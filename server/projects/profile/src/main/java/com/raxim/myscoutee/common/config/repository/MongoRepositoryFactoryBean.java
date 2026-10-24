package com.raxim.myscoutee.common.config.repository;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.jspecify.annotations.Nullable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;
import org.springframework.util.Assert;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class MongoRepositoryFactoryBean<T extends Repository<S, ID>, S, ID extends Serializable>
		extends RepositoryFactoryBeanSupport<T, S, ID> {
	private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(MongoRepositoryFactoryBean.class);

	private static final String PARAM_REGEX = "\"([:|\\?|I|M][^ ].*?)\"";

	private @Nullable MongoOperations operations;
	private boolean createIndexesForQueryMethods = false;
	private boolean mappingContextConfigured = false;

	public MongoRepositoryFactoryBean(Class<? extends T> repositoryInterface) {
		super(repositoryInterface);
	}

	public void setMongoOperations(MongoOperations operations) {
		this.operations = operations;
	}

	public void setCreateIndexesForQueryMethods(boolean createIndexesForQueryMethods) {
		this.createIndexesForQueryMethods = createIndexesForQueryMethods;
	}

	@Override
	public void setMappingContext(MappingContext<?, ?> mappingContext) {

		super.setMappingContext(mappingContext);
		this.mappingContextConfigured = true;
	}

	@Override
	protected RepositoryFactorySupport createRepositoryFactory() {

		Map<String, String[]> queryMap = loadQueries();

		RepositoryFactorySupport factory = getFactoryInstance(operations, queryMap);

		if (createIndexesForQueryMethods) {
			factory.addQueryCreationListener(
					new IndexEnsuringQueryCreationListener(
							(collectionName, javaType) -> operations.indexOps(javaType)));
		}

		return factory;
	}

	protected RepositoryFactorySupport getFactoryInstance(MongoOperations operations, Map<String, String[]> queryMap) {
		return new MongoRepositoryFactory(operations, queryMap);
	}

	@Override
	public void afterPropertiesSet() {

		super.afterPropertiesSet();
		Assert.state(operations != null, "MongoTemplate must not be null");

		if (!mappingContextConfigured) {
			setMappingContext(operations.getConverter().getMappingContext());
		}
	}

	private Map<String, String[]> loadQueries() {
		Map<String, String[]> queryMap = new HashMap<>();
		try {
			String repositoryName = getObjectType().getSimpleName().replaceFirst("Repository", "").toLowerCase();
			ClassPathResource classPathResource = new ClassPathResource("/mongo/" + repositoryName);
			if (classPathResource.exists()) {
				System.out.println(repositoryName + " is being loaded!");

				// Spring resolves both exploded classes and packaged (including nested) JAR resources.
				// No shared ZIP filesystem is mounted or retained by the repository factory.
				var resolver = new PathMatchingResourcePatternResolver(classPathResource.getClassLoader());
				ObjectMapper objectMapper = new ObjectMapper();
				for (Resource resource : resolver.getResources("classpath:/mongo/" + repositoryName + "/*")) {
					if (!resource.isReadable()) continue;
					try (InputStream input = resource.getInputStream()) {
						List<Document> documents = objectMapper.readValue(input, new TypeReference<List<Document>>() {});
						String[] stages = documents.stream()
								.map(pipeline -> pipeline.toJson().replaceAll(PARAM_REGEX, "$1"))
								.toArray(String[]::new);
						String name = resource.getFilename();
						Assert.notNull(name, "Query resource must have a filename");
						queryMap.putIfAbsent(name.substring(0, name.lastIndexOf(".")), stages);
					} catch (IOException e) {
						LOGGER.warn("Cannot load Mongo query resource for repository {}", repositoryName);
					}
				}
				System.out.println(repositoryName + " has been loaded!");
			} else {
				System.out.println(repositoryName + " hasn't any file to load!");
			}
		} catch (IOException e) {
			LOGGER.warn("Cannot enumerate Mongo query resources");
		}
		return queryMap;
	}

}
