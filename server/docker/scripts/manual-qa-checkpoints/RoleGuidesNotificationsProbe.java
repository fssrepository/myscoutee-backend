import java.lang.reflect.*;
import java.util.*;
import org.bson.Document;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactory;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.platform.config.ConfigProperties;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.accounts.document.UserLoginAudit;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.help.document.HelpCenterGuideField;
import com.raxim.myscoutee.domain.help.document.HelpCenterRevision;
import com.raxim.myscoutee.domain.notifications.document.UserNotification;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.*;
import com.raxim.myscoutee.domain.accounts.repository.PrivacyConsentsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserLoginAuditsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.help.repository.HelpCenterAuditRepository;
import com.raxim.myscoutee.domain.help.repository.HelpCenterGuideFieldsRepository;
import com.raxim.myscoutee.domain.help.repository.HelpCenterRevisionsRepository;
import com.raxim.myscoutee.domain.notifications.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationPageRepository;
import com.raxim.myscoutee.domain.notifications.repository.UserNotificationsRepository;
import com.raxim.myscoutee.domain.accounts.service.UserLoginSessionService;
import com.raxim.myscoutee.domain.help.service.HelpCenterService;
import com.raxim.myscoutee.domain.platform.service.AppSettingsService;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;
import com.raxim.myscoutee.domain.notifications.mapper.UserNotificationMapper;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.service.RoleNotificationService;
import com.raxim.myscoutee.domain.notifications.service.UserNotificationService;

/** Uses existing compiled classes and temporary, prefixed collections in the running demo Mongo.
 * No application compilation, Spring server, fixture reset, real inbox write or external delivery. */
class RoleGuidesNotificationsProbe {
  static String prefix = "qa_msc118_" + UUID.randomUUID().toString().replace("-", "") + "_";
  static MongoTemplate isolatedMongo(MongoClient client) {
    var delegate=new org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory(client,"demo_db");
    var database=(MongoDatabase)Proxy.newProxyInstance(MongoDatabase.class.getClassLoader(),new Class[]{MongoDatabase.class},(proxy,method,args)->{
      if(args!=null && args.length>0 && (method.getName().equals("getCollection") || method.getName().equals("createCollection"))) {
        args=args.clone();if(!args[0].toString().startsWith(prefix)) args[0]=prefix+args[0];
      }
      if(method.getName().equals("runCommand") && args!=null && args[0] instanceof org.bson.conversions.Bson bson) {
        args=args.clone();var command=bson.toBsonDocument(Document.class,client.getDatabase("demo_db").getCodecRegistry()).clone();
        for(String key:List.of("find","count","distinct","findAndModify","aggregate","update","delete","insert")) {
          if(command.containsKey(key)&&command.get(key).isString()&&!command.getString(key).getValue().startsWith(prefix)) command.put(key,new org.bson.BsonString(prefix+command.getString(key).getValue()));
        }
        args[0]=command;
      }
      return method.invoke(client.getDatabase("demo_db"),args);
    });
    var factory=(org.springframework.data.mongodb.MongoDatabaseFactory)Proxy.newProxyInstance(
      org.springframework.data.mongodb.MongoDatabaseFactory.class.getClassLoader(),new Class[]{org.springframework.data.mongodb.MongoDatabaseFactory.class},(proxy,method,args)->
        method.getName().equals("getMongoDatabase")?database:method.invoke(delegate,args));
    return new MongoTemplate(factory);
  }
  static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
  static void field(Object object, String name, Object value) throws Exception {
    Field field = object.getClass().getDeclaredField(name); field.setAccessible(true); field.set(object,value);
  }
  static Object call(Object object, String method, Class<?>[] types, Object... args) throws Exception {
    Method m=object.getClass().getDeclaredMethod(method,types);m.setAccessible(true);
    try { return m.invoke(object,args); } catch(InvocationTargetException e) {
      if(e.getCause() instanceof Exception x) throw x; throw e;
    }
  }
  interface Action { void run() throws Exception; }
  static void forbidden(Action action) throws Exception {
    try { action.run(); throw new AssertionError("System write was accepted"); }
    catch (ResponseStatusException e) { check(e.getStatusCode().value()==403,"Expected 403: "+e); }
  }
  static Users user(String id, boolean operator) {
    Users value=new Users();value.setUserId(id);value.setId(id);value.setSyncKey(id);value.setEmail(id+"@qa.invalid");
    value.setOperator(operator);value.setStatus("A");value.setProfileStatus("public");return value;
  }
  @SuppressWarnings("removal")
  public static void main(String[] args) throws Exception {
    if(!"demo_db".equals(System.getenv("MONGODB_DEMO_DATABASE"))) throw new IllegalStateException("Requires the existing demo_db runtime.");
    ((ch.qos.logback.classic.Logger) org.slf4j.LoggerFactory.getLogger("org.mongodb.driver")).setLevel(ch.qos.logback.classic.Level.WARN);
    var settings=MongoClientSettings.builder().applyToClusterSettings(b->b.hosts(List.of(new ServerAddress(System.getenv("MONGODB_HOST"),27017))))
      .credential(MongoCredential.createCredential(System.getenv("MONGO_APP_USERNAME"),"demo_db",System.getenv("MONGO_APP_PASSWORD").toCharArray())).build();
    try(var client=MongoClients.create(settings)) {
      try {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        var mongo=isolatedMongo(client);var factory=new MongoRepositoryFactory(mongo);
        mongo.indexOps(UserNotification.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
          .on("syncKey",org.springframework.data.domain.Sort.Direction.ASC).unique());
        mongo.indexOps(UserLoginAudit.class).ensureIndex(new org.springframework.data.mongodb.core.index.Index()
          .on("attemptId",org.springframework.data.domain.Sort.Direction.ASC).unique());
        var users=factory.getRepository(UsersRepository.class);
        users.saveAll(List.of(user("operator",true),user("admin",false),user("member",false)));
        var config=new ConfigProperties();config.setOperatorUser("operator@qa.invalid");
        var appSettings=new AppSettingsService(null) {
          @Override public List<String> adminEmails(){return List.of("admin@qa.invalid");}
          @Override public boolean isAdminEmail(String email){return "admin@qa.invalid".equals(email);}
        };
        var inbox=new UserNotificationService(factory.getRepository(UserNotificationsRepository.class),new UserNotificationPageRepository(mongo),users,new UserNotificationMapper(users));
        var beans=new DefaultListableBeanFactory();beans.registerSingleton("inbox",inbox);
        var outbox=new NotificationOutboxService(factory.getRepository(NotificationOutboxRepository.class),null,null,null,beans.getBeanProvider(UserNotificationService.class));
        field(outbox,"jobGroupScope",new JobGroupScopeService(mongo));field(outbox,"configProperties",config);
        field(outbox,"usersRepository",users);field(outbox,"mongoTemplate",mongo);
        var roles=new RoleNotificationService(users,config,appSettings,outbox);
        roles.releaseAvailable("1.2.3");roles.releaseAvailable("1.2.3");
        roles.memberJoined(user("joined",false));roles.memberJoined(user("joined",false));
        roles.moderationSubmitted("report-submitted","report1");roles.moderationSubmitted("feedback-submitted","feedback1");
        var op=inbox.queryPage("operator","all",50,null);var admin=inbox.queryPage("admin","all",50,null);
        check(op.records().size()==2 && op.unreadCount()==2,"Operator release/join dedup: " + op.records().size() + "/" + op.unreadCount());
        check(admin.records().size()==3 && admin.unreadCount()==3,"Admin join/report/feedback");
        check(inbox.queryPage("member","all",50,null).total()==0,"Role event leaked to member");
        var release=op.records().stream().filter(n->n.kind().equals("release-available")).findFirst().orElseThrow();
        check(release.actionPath().equals("/operator?notificationTarget=updates"),"Release target");
        try { inbox.markRead("member",release.id());throw new AssertionError("Cross-recipient read"); }
        catch(ResponseStatusException expected){check(expected.getStatusCode().value()==404,"Cross read status");}
        inbox.markRead("operator",release.id());inbox.markRead("operator",release.id());
        check(inbox.queryPage("operator","new",50,null).unreadCount()==1,"Read counter dedup");
        check(users.findByUserId("operator").orElseThrow().getActivities().notifications()==1,"Stored unread counter");
        System.out.println("PASS compiled Java + Mongo: role events, durable outbox/inbox dedup, targets, recipient isolation, read counters");

        var audit=factory.getRepository(UserLoginAuditsRepository.class);
        var login=new UserLoginSessionService(mongo,audit,outbox,-1);
        login.recordBootstrapLogin("operator@qa.invalid",null);
        check(inbox.queryPage("operator","all",50,null).records().stream().anyMatch(n->n.kind().equals("security-login")&&n.actionPath().equals("/operator")),"Bootstrap login notice");
        var principal=new FirebasePrincipal("admin","admin@qa.invalid","A",users.findByUserId("admin").orElseThrow());
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(principal,null,principal.getAuthorities()));
        var req1=new com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSessionLoginRequestDto("attempt1","demo");
        var req2=new com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSessionLoginRequestDto("attempt2","demo");
        login.registerLogin("session1",req1,null);login.registerLogin("session2",req2,null);login.registerLogin("session2",req2,null);
        check(inbox.queryPage("admin","all",50,null).records().stream().filter(n->n.kind().equals("security-login")&&n.actionPath().equals("/admin")).count()==1,"Admin login route/retry");
        System.out.println("PASS compiled login audit: bootstrap operator and repeated admin session attempt, correct role URLs");

        var guideFields=factory.getRepository(HelpCenterGuideFieldsRepository.class);
        for(String context:List.of("operator.home","landing.home")) {
          var guideField=new HelpCenterGuideField();guideField.setDocumentId(context+":overview");
          guideField.setId("overview");guideField.setScreenKey(context);guideFields.save(guideField);
        }
        var revisions=factory.getRepository(HelpCenterRevisionsRepository.class);
        var system=new HelpCenterRevision();system.setId("qa-system");system.setDocumentType("explanation");system.setContextKey("operator.home");
        system.setLang("en");system.setVersion(1);system.setActive(true);system.setIsSystem(true);system.setTitle("System guide");revisions.save(system);
        check(revisions.existsByDocumentTypeAndContextKeyAndIsSystemTrue("explanation","operator.home"),"Mongo isSystem mapping");
        check(revisions.findFirstByBaseGroupIdAndDocumentTypeAndLangAndContextKeyAndActiveTrueOrderByVersionDesc(null,"explanation","en","operator.home").orElseThrow().getIsSystem(),"Active indexed lookup");
        var help=new HelpCenterService(config,revisions,factory.getRepository(HelpCenterAuditRepository.class),factory.getRepository(HelpCenterGuideFieldsRepository.class),factory.getRepository(PrivacyConsentsRepository.class),null,appSettings,null);
        var request=new HelpCenterRevisionSaveRequestDto("admin",null,"operator.home","hu","Draft","","","neutral","tour",List.of());
        forbidden(()->call(help,"saveRevisionInGroup",new Class[]{HelpCenterRevisionSaveRequestDto.class,String.class},request,"explanation"));
        var clone=new HelpCenterRevisionSaveRequestDto("admin","qa-system","landing.home","en","Draft","","","neutral","tour",List.of());
        forbidden(()->call(help,"saveRevisionInGroup",new Class[]{HelpCenterRevisionSaveRequestDto.class,String.class},clone,"explanation"));
        var action=new HelpCenterAdminActionRequestDto("admin");
        forbidden(()->call(help,"activateRevisionInGroup",new Class[]{String.class,HelpCenterAdminActionRequestDto.class,String.class},"qa-system",action,"explanation"));
        forbidden(()->call(help,"deleteRevisionInGroup",new Class[]{String.class,HelpCenterAdminActionRequestDto.class,String.class},"qa-system",action,"explanation"));
        check(revisions.count()==1&&revisions.findById("qa-system").orElseThrow().getActive(),"Protected revision mutated");
        var state=(HelpCenterStateDto)call(help,"fullState",new Class[]{String.class,String.class,String.class},"explanation","en",null);
        check(state.revisions().isEmpty(),"System content in admin state");
        System.out.println("PASS compiled Java + Mongo: isSystem persistence, direct active lookup, editor exclusion and 403 create/clone/activate/delete");
      } finally {
        SecurityContextHolder.clearContext();MongoSessionModeContext.clear();
        var db=client.getDatabase("demo_db");
        for(String name:db.listCollectionNames()) if(name.startsWith(prefix)) db.getCollection(name).drop();
        for(String name:db.listCollectionNames()) check(!name.startsWith(prefix),"Probe cleanup");
        System.out.println("PASS isolated probe collections removed; existing fixtures and inboxes untouched");
      }
    }
  }
}
