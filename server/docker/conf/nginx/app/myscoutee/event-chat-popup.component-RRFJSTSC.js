import {
  EventSubeventsPopupStore
} from "./chunk-RKNUQ7BV.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-EFOSAJ7V.js";
import "./chunk-K46F5X52.js";
import "./chunk-DCIHJJ5Y.js";
import "./chunk-PA3YBM43.js";
import "./chunk-FJ66QUKQ.js";
import "./chunk-SYKOEE4K.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore,
  ProfileStore,
  eventChatHeaderStateFromChat
} from "./chunk-PM3I2T2H.js";
import {
  SmartListComponent
} from "./chunk-QGX3AOF4.js";
import {
  SubEventResourcePopupStore
} from "./chunk-7YBTTPXY.js";
import "./chunk-ECWKXWGH.js";
import "./chunk-QNXIGSHX.js";
import "./chunk-UNJZCHXH.js";
import "./chunk-JEQIAF2O.js";
import "./chunk-U7SHZOGZ.js";
import {
  ActivityChatSingleRowConverter,
  ActivityEventInfoCardMenuConverter,
  ChatPopupHeaderContextConverter
} from "./chunk-52WP4I47.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-XXLX3JOX.js";
import "./chunk-BN6P7BIB.js";
import {
  UiPollCoordinator,
  UiTaskScheduler
} from "./chunk-LXXIK2TC.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-RB7FL7JP.js";
import "./chunk-L4DRPM6F.js";
import "./chunk-YAY5TUPV.js";
import {
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent,
  AppMenuTriggerComponent,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-QD6QQNQX.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-NJTJOLRZ.js";
import "./chunk-ZJ74HL3J.js";
import {
  ActivityResourcesService,
  ChatsService,
  MediaService
} from "./chunk-C2QYRRDX.js";
import {
  EventsService,
  ShareTokensService
} from "./chunk-Y3NEBFNQ.js";
import {
  DeploymentConfigurationService
} from "./chunk-PB4YNHSN.js";
import {
  AppRuntimeStore,
  ChatVoiceClipsService
} from "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import {
  ActivityResourceBuilder,
  AssetDefaultsBuilder
} from "./chunk-Y2Y4ZDHH.js";
import {
  I18nService
} from "./chunk-B7YPVC5F.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_TRANSPORT,
  AppUtils,
  isAssetType
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule,
  Location,
  NgComponentOutlet
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-2IE5VYAT.js";
import "./chunk-B2DKYQGD.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-INZQPXQM.js";
import "./chunk-IECLTXM5.js";
import "./chunk-333NTD7D.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  of,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-chat-popup/chat-message-read-state.ts
function mergeChatReadAvatars(...readerGroups) {
  const readers = [];
  const readerIndexById = /* @__PURE__ */ new Map();
  for (const readerGroup of readerGroups) {
    for (const reader of readerGroup ?? []) {
      const id = `${reader?.id ?? ""}`.trim();
      if (!id) {
        continue;
      }
      const existingIndex = readerIndexById.get(id);
      if (existingIndex === void 0) {
        readerIndexById.set(id, readers.length);
        readers.push(__spreadProps(__spreadValues({}, reader), { id }));
        continue;
      }
      const existing = readers[existingIndex];
      readers[existingIndex] = __spreadProps(__spreadValues(__spreadValues({}, existing), reader), {
        id,
        initials: `${reader.initials ?? ""}`.trim() || existing.initials,
        gender: reader.gender || existing.gender,
        imageUrl: reader.imageUrl?.trim() || existing.imageUrl
      });
    }
  }
  return readers;
}

// src/app/activity/components/event-chat-popup/event-chat-popup.component.ts
var _c0 = ["chatThreadSmartList"];
var _c1 = ["messageTextarea"];
var _c2 = ["imageAttachmentInput"];
var _c3 = ["chatComposeBox"];
var _c4 = () => [];
var _forTrack0 = ($index, $item) => $item.token;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.userId;
var _forTrack3 = ($index, $item) => $item.emoji;
var _forTrack4 = ($index, $item) => $item.userId + $item.emoji;
function EventChatPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "span", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 20);
    \u0275\u0275element(4, "span")(5, "span")(6, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.typingIndicatorLabel());
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "span", 21)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "small");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 22);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_8_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearReplyTarget());
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Replying to ", ctx_r1.replyTarget.sender);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.replyTarget.text);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Editing message ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 23);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_9_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelEditing());
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "audio", 26);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx_r1.voiceClipDataUrl);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 31)(1, "button", 32);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_5_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.voiceRecordingState === "recording" ? ctx_r1.stopVoiceRecording($event) : ctx_r1.startVoiceRecording($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 33);
    \u0275\u0275element(5, "span")(6, "span")(7, "span")(8, "span")(9, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-recording", ctx_r1.voiceRecordingState === "recording");
    \u0275\u0275advance();
    \u0275\u0275classProp("is-recording", ctx_r1.voiceRecordingState === "recording");
    \u0275\u0275property("disabled", ctx_r1.voiceRecordingState === "saving");
    \u0275\u0275attribute("aria-label", ctx_r1.voiceRecordingState === "recording" ? "Stop recording" : "Start recording");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.voiceRecordingState === "recording" ? "stop" : "mic");
    \u0275\u0275advance();
    \u0275\u0275classProp("is-recording", ctx_r1.voiceRecordingState === "recording");
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.voiceRecorderError);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_14_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "button", 25);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_14_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.discardVoiceRecording($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(4, EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_4_Template, 1, 1, "audio", 26)(5, EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_5_Template, 10, 9, "span", 27);
    \u0275\u0275elementStart(6, "span", 28);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 29);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_14_Template_button_click_8_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sendVoiceClip($event));
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, EventChatPopupComponent_Conditional_0_Conditional_14_Conditional_11_Template, 2, 1, "span", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.voiceRecordingState === "saving");
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.voiceRecordingState === "recorded" && ctx_r1.voiceClipDataUrl ? 4 : 5);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatVoiceDuration(ctx_r1.voiceRecorderSeconds));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.canSendVoiceClip() || ctx_r1.voiceRecordingState === "saving");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.voiceRecordingState === "saving" ? "hourglass_empty" : "send");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.voiceRecorderError ? 11 : -1);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("mousedown", function EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_For_2_Template_button_mousedown_0_listener($event) {
      return $event.preventDefault();
    })("click", function EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_For_2_Template_button_click_0_listener($event) {
      const suggestion_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.applyComposerEmojiSuggestion(suggestion_r9, $event));
    });
    \u0275\u0275elementStart(1, "span", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 40);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const suggestion_r9 = ctx.$implicit;
    \u0275\u0275attribute("aria-label", suggestion_r9.token + " " + suggestion_r9.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(suggestion_r9.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(suggestion_r9.token);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(suggestion_r9.label);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_For_2_Template, 7, 4, "button", 37, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emojiSuggestions_r10 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(emojiSuggestions_r10);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Conditional_0_Template, 3, 0, "div", 36);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length > 0 ? 0 : -1);
  }
}
function EventChatPopupComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_0_Conditional_15_Conditional_0_Template, 1, 1);
    \u0275\u0275elementStart(1, "textarea", 34, 4);
    \u0275\u0275twoWayListener("ngModelChange", function EventChatPopupComponent_Conditional_0_Conditional_15_Template_textarea_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.draftMessage, $event) || (ctx_r1.draftMessage = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function EventChatPopupComponent_Conditional_0_Conditional_15_Template_textarea_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDraftMessageChange($event));
    })("input", function EventChatPopupComponent_Conditional_0_Conditional_15_Template_textarea_input_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resizeComposerTextarea());
    })("keydown", function EventChatPopupComponent_Conditional_0_Conditional_15_Template_textarea_keydown_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onComposerKeydown($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 35);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_0_Conditional_15_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.sendMessage());
    });
    \u0275\u0275elementStart(4, "mat-icon");
    \u0275\u0275text(5, "send");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_8_0 = ctx_r1.composerEmojiSuggestions()) ? 0 : -1, tmp_8_0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.draftMessage);
    \u0275\u0275property("disabled", ctx_r1.chatInitialLoadPending);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.chatInitialLoadPending);
  }
}
function EventChatPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 7)(1, "div", 8)(2, "div", 9)(3, "app-smart-list", 10, 1);
    \u0275\u0275listener("menuItemSelect", function EventChatPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDispatchedChatMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventChatPopupComponent_Conditional_0_Conditional_5_Template, 7, 1, "div", 11);
    \u0275\u0275elementStart(6, "div", 12, 2);
    \u0275\u0275conditionalCreate(8, EventChatPopupComponent_Conditional_0_Conditional_8_Template, 9, 2, "div", 13);
    \u0275\u0275conditionalCreate(9, EventChatPopupComponent_Conditional_0_Conditional_9_Template, 8, 0, "div", 14);
    \u0275\u0275elementStart(10, "span", 15)(11, "app-menu", 16);
    \u0275\u0275listener("itemSelect", function EventChatPopupComponent_Conditional_0_Template_app_menu_itemSelect_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onInlineChatMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "input", 17, 3);
    \u0275\u0275listener("change", function EventChatPopupComponent_Conditional_0_Template_input_change_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageAttachmentSelected($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, EventChatPopupComponent_Conditional_0_Conditional_14_Template, 12, 6, "div", 18)(15, EventChatPopupComponent_Conditional_0_Conditional_15_Template, 6, 4);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const chatSession_r11 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    const chatThreadMessageTemplate_r12 = \u0275\u0275reference(3);
    \u0275\u0275styleProp("--chat-shell-z-index", ctx_r1.chatPopupZIndex(chatSession_r11))("--chat-compose-detached-space", ctx_r1.chatComposeDetachedSpace, "px");
    \u0275\u0275property("model", ctx_r1.chatPopupModel(chatSession_r11))("zIndex", ctx_r1.chatPopupZIndex(chatSession_r11));
    \u0275\u0275attribute("data-chat-id", chatSession_r11.item.id);
    \u0275\u0275advance(3);
    \u0275\u0275property("config", ctx_r1.chatThreadSmartListConfig)("loadPage", ctx_r1.chatThreadLoadPage)("itemTemplate", chatThreadMessageTemplate_r12)("query", ctx_r1.chatThreadQuery);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.typingIndicators.length > 0 ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.replyTarget ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.editingMessageId ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("trigger", ctx_r1.composerMenuTrigger())("items", ctx_r1.composerMenuItems())("openUp", true);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.voiceComposerOpen ? 14 : 15);
  }
}
function EventChatPopupComponent_Conditional_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 45)(1, "input", 49);
    \u0275\u0275twoWayListener("ngModelChange", function EventChatPopupComponent_Conditional_1_For_6_Template_input_ngModelChange_1_listener($event) {
      const \u0275$index_140_r15 = \u0275\u0275restoreView(_r14).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.pollOptionDrafts[\u0275$index_140_r15], $event) || (ctx_r1.pollOptionDrafts[\u0275$index_140_r15] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 50);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_1_For_6_Template_button_click_2_listener($event) {
      const \u0275$index_140_r15 = \u0275\u0275restoreView(_r14).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removePollOption(\u0275$index_140_r15, $event));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const \u0275$index_140_r15 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", "Option " + (\u0275$index_140_r15 + 1));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pollOptionDrafts[\u0275$index_140_r15]);
    \u0275\u0275property("disabled", ctx_r1.chatInitialLoadPending);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Remove option " + (\u0275$index_140_r15 + 1));
  }
}
function EventChatPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 41)(2, "div", 42)(3, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function EventChatPopupComponent_Conditional_1_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.pollQuestionDraft, $event) || (ctx_r1.pollQuestionDraft = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 44);
    \u0275\u0275repeaterCreate(5, EventChatPopupComponent_Conditional_1_For_6_Template, 5, 4, "span", 45, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 46)(8, "button", 47);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_1_Template_button_click_8_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addPollOption($event));
    });
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "add_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Add option... ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 48);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_1_Template_button_click_12_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.sendPoll($event));
    });
    \u0275\u0275text(13, " Create Poll ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.createPollPopupModel())("zIndex", ctx_r1.chatDialogZIndex());
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.pollQuestionDraft);
    \u0275\u0275property("disabled", ctx_r1.chatInitialLoadPending);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pollOptionDrafts);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.pollOptionDrafts.length >= 6);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.canCreatePoll());
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_1_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const replyPreview_r19 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(replyPreview_r19.meta);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65)(1, "span", 66);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, EventChatPopupComponent_ng_template_2_Conditional_1_Conditional_5_Conditional_3_Template, 2, 1, "span", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const replyPreview_r19 = ctx;
    \u0275\u0275classProp("chat-message-reply-quote--structured", replyPreview_r19.meta);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(replyPreview_r19.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(replyPreview_r19.meta ? 3 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 62);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      const message_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.jumpToReplySource(message_r17, $event));
    })("contextmenu", function EventChatPopupComponent_ng_template_2_Conditional_1_Template_button_contextmenu_0_listener($event) {
      \u0275\u0275restoreView(_r18);
      $event.preventDefault();
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "span", 63)(2, "mat-icon");
    \u0275\u0275text(3, "reply");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventChatPopupComponent_ng_template_2_Conditional_1_Conditional_5_Template, 4, 4, "span", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const message_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", message_r17.mine ? "You replied" : message_r17.sender + " replied", " to ", message_r17.replyTo.sender, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r1.replyPreviewParts(message_r17.replyTo)) ? 5 : -1, tmp_6_0);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "auto_awesome");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 69);
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("src", message_r17.senderAvatar.imageUrl, \u0275\u0275sanitizeUrl)("alt", message_r17.sender);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275textInterpolate1(" ", message_r17.senderAvatar.initials, " ");
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_1_Template, 2, 0, "mat-icon")(2, EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_2_Template, 1, 2, "img", 69)(3, EventChatPopupComponent_ng_template_2_Conditional_3_Conditional_3_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("user-color-" + message_r17.senderAvatar.gender);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.senderAvatar.gender === "system" ? 1 : message_r17.senderAvatar.imageUrl ? 2 : 3);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "span", 70);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 71);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r17.sender);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r17.time);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 57);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.deletedMessageLabel(message_r17));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 69);
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("src", attachment_r20.previewUrl || attachment_r20.url, \u0275\u0275sanitizeUrl)("alt", attachment_r20.title);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "figure", 75);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_0_Conditional_1_Template, 1, 2, "img", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275conditional(attachment_r20.previewUrl || attachment_r20.url ? 1 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attachment_r20.subtitle);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 80);
    \u0275\u0275element(1, "audio", 82);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r1.voiceAttachmentAudioSrc(attachment_r20));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 81);
    \u0275\u0275text(1, "Audio unavailable");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 76)(1, "span", 78)(2, "mat-icon");
    \u0275\u0275text(3, "mic");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 79)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_7_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_8_Template, 2, 1, "span", 80)(9, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Conditional_9_Template, 2, 0, "small", 81);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(attachment_r20.title || "Voice clip");
    \u0275\u0275advance();
    \u0275\u0275conditional(attachment_r20.subtitle ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.voiceAttachmentAudioSrc(attachment_r20) ? 8 : 9);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_For_5_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 92);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vote_r22 = ctx.$implicit;
    \u0275\u0275classMap("user-color-" + vote_r22.gender);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(vote_r22.initials);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 85)(1, "span", 87)(2, "span", 88);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 89);
    \u0275\u0275repeaterCreate(5, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_For_5_For_6_Template, 2, 3, "span", 90, _forTrack2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 91);
    \u0275\u0275element(8, "span");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r23 = ctx.$implicit;
    const poll_r24 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(option_r23.text);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(option_r23.votes.slice(0, 3));
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.pollOptionPercent(poll_r24, option_r23), "%");
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 83)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 84);
    \u0275\u0275repeaterCreate(4, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_For_5_Template, 9, 3, "div", 85, _forTrack1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 86);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_Template_button_click_6_listener($event) {
      \u0275\u0275restoreView(_r21);
      const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
      const message_r17 = \u0275\u0275nextContext(3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPollVoteDialog(message_r17, attachment_r20, $event));
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const poll_r24 = ctx;
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(poll_r24.question);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(poll_r24.options);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.pollOwnVoteOptionId(attachment_r20) ? "Change vote" : "Vote", " ");
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Conditional_0_Template, 8, 2, "div", 83);
  }
  if (rf & 2) {
    let tmp_17_0;
    const attachment_r20 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_17_0 = ctx_r1.pollState(attachment_r20)) ? 0 : -1, tmp_17_0);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 94);
    \u0275\u0275element(1, "img", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", attachment_r20.previewUrl, \u0275\u0275sanitizeUrl)("alt", attachment_r20.title);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.unavailableAttachmentLabel(attachment_r20));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attachment_r20.subtitle);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 98);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attachment_r20.description);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_1_Template, 2, 2, "span", 94);
    \u0275\u0275elementStart(2, "span", 95)(3, "span", 96)(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_9_Template, 2, 1, "small", 97);
    \u0275\u0275conditionalCreate(10, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_10_Template, 2, 1, "small");
    \u0275\u0275conditionalCreate(11, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Conditional_11_Template, 2, 1, "span", 98);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const attachment_r20 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("chat-card-attachment-event", attachment_r20.type === "event")("chat-card-attachment-asset", attachment_r20.type === "asset")("chat-card-attachment-link", attachment_r20.type === "link")("chat-card-attachment-unavailable", ctx_r1.isAttachmentUnavailable(attachment_r20));
    \u0275\u0275attribute("aria-disabled", ctx_r1.isAttachmentUnavailable(attachment_r20));
    \u0275\u0275advance();
    \u0275\u0275conditional(attachment_r20.previewUrl ? 1 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.chatAttachmentIcon(attachment_r20));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.chatAttachmentTypeLabel(attachment_r20), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(attachment_r20.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isAttachmentUnavailable(attachment_r20) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(attachment_r20.subtitle ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(attachment_r20.description ? 11 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_0_Template, 2, 1, "figure", 75)(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_1_Template, 10, 3, "div", 76)(2, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_2_Template, 1, 1)(3, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Conditional_3_Template, 12, 16, "div", 77);
  }
  if (rf & 2) {
    const attachment_r20 = ctx.$implicit;
    \u0275\u0275conditional(attachment_r20.type === "image" ? 0 : attachment_r20.type === "voice" ? 1 : attachment_r20.type === "poll" ? 2 : attachment_r20.type === "event" || attachment_r20.type === "asset" || attachment_r20.type === "link" ? 3 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_For_2_Template, 4, 1, null, null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(message_r17.attachments);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 100);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r25);
      const segment_r26 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openChatTextLink(segment_r26.url, $event));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const segment_r26 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(segment_r26.text);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const segment_r26 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(segment_r26.text);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Conditional_0_Template, 2, 1, "button", 99)(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Conditional_1_Template, 2, 1, "span");
  }
  if (rf & 2) {
    const segment_r26 = ctx.$implicit;
    \u0275\u0275conditional(segment_r26.url ? 0 : 1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 73);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_For_2_Template, 2, 1, null, null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.chatTextSegments(message_r17.text));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 74);
    \u0275\u0275text(1, "Edited");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_0_Template, 3, 0, "div", 72);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_1_Template, 3, 0, "p", 73);
    \u0275\u0275conditionalCreate(2, EventChatPopupComponent_ng_template_2_Conditional_7_Conditional_2_Template, 2, 0, "span", 74);
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional((message_r17.attachments ?? \u0275\u0275pureFunction0(3, _c4)).length > 0 ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.text ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.editedAtIso ? 2 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 58)(1, "mat-icon");
    \u0275\u0275text(2, "push_pin");
    \u0275\u0275elementEnd()();
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reaction_r28 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", reaction_r28.emoji, " ", reaction_r28.count);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 101);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_9_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r27);
      const message_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openReactionDetails(message_r17, $event));
    });
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_ng_template_2_Conditional_9_For_2_Template, 2, 2, "span", null, _forTrack3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.reactionSummary(message_r17));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 102);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_10_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "button", 103);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_10_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r29);
      const message_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.setReplyTarget(message_r17, $event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "reply");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 104);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_10_Template_button_click_4_listener($event) {
      \u0275\u0275restoreView(_r29);
      const message_r17 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleQuickReactions(message_r17, $event));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "app-menu-trigger", 105);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r17 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("chat-message-tools-down", ctx_r1.selectedMessageToolsDown);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("chat-tool-btn-open", ctx_r1.quickReactionMessageId && ctx_r1.quickReactionMessageId === message_r17.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.quickReactionMessageId && ctx_r1.quickReactionMessageId === message_r17.id ? "add_reaction" : "mood");
    \u0275\u0275advance();
    \u0275\u0275property("menuId", ctx_r1.messageActionMenuIdFor(message_r17))("trigger", ctx_r1.messageActionMenuTrigger(message_r17))("items", ctx_r1.messageActionMenuItems(message_r17));
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_11_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_11_For_2_Template_button_click_0_listener($event) {
      const emoji_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const message_r17 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleReaction(message_r17, emoji_r31, $event));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emoji_r31 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emoji_r31);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_11_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-menu-trigger", 108);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("trigger", ctx_r1.emojiPickerMenuTrigger())("model", ctx_r1.emojiPickerMenuModel())("filterable", true)("closeOnSelect", true);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_11_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 110);
    \u0275\u0275listener("itemSelect", function EventChatPopupComponent_ng_template_2_Conditional_11_Conditional_4_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r32);
      const message_r17 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEmojiPickerMenuSelect(message_r17, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("trigger", ctx_r1.emojiPickerMenuTrigger())("model", ctx_r1.emojiPickerMenuModel())("filterable", true)("closeOnSelect", true);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 106);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Conditional_11_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_ng_template_2_Conditional_11_For_2_Template, 2, 1, "button", 107, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(3, EventChatPopupComponent_ng_template_2_Conditional_11_Conditional_3_Template, 1, 4, "app-menu-trigger", 108)(4, EventChatPopupComponent_ng_template_2_Conditional_11_Conditional_4_Template, 1, 4, "app-menu", 109);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("chat-quick-reactions-down", ctx_r1.quickReactionOpenDown)("chat-quick-reactions-tools-down", ctx_r1.selectedMessageToolsDown);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.quickReactionEmojis);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isMobileView() ? 3 : 4);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 69);
  }
  if (rf & 2) {
    const reader_r33 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", reader_r33.imageUrl, \u0275\u0275sanitizeUrl)("alt", reader_r33.initials);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const reader_r33 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", reader_r33.initials, " ");
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 113);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Conditional_1_Template, 1, 2, "img", 69)(2, EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reader_r33 = ctx.$implicit;
    const message_r17 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap("user-color-" + reader_r33.gender);
    \u0275\u0275classProp("chat-reader-fresh", ctx_r1.isFreshRead(message_r17.id, reader_r33.id));
    \u0275\u0275advance();
    \u0275\u0275conditional(reader_r33.imageUrl ? 1 : 2);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_For_2_Template, 3, 5, "span", 112, \u0275\u0275componentInstance().trackByChatReader, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const visibleReaders_r34 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(visibleReaders_r34);
  }
}
function EventChatPopupComponent_ng_template_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_ng_template_2_Conditional_12_Conditional_0_Template, 3, 0, "div", 111);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length > 0 ? 0 : -1);
  }
}
function EventChatPopupComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 51);
    \u0275\u0275listener("click", function EventChatPopupComponent_ng_template_2_Template_article_click_0_listener($event) {
      const message_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectMessage(message_r17, $event));
    })("touchstart", function EventChatPopupComponent_ng_template_2_Template_article_touchstart_0_listener() {
      const message_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startMessageLongPress(message_r17));
    })("touchend", function EventChatPopupComponent_ng_template_2_Template_article_touchend_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearMessageLongPress());
    })("touchcancel", function EventChatPopupComponent_ng_template_2_Template_article_touchcancel_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearMessageLongPress());
    });
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_ng_template_2_Conditional_1_Template, 6, 3, "button", 52);
    \u0275\u0275elementStart(2, "div", 53);
    \u0275\u0275conditionalCreate(3, EventChatPopupComponent_ng_template_2_Conditional_3_Template, 4, 3, "span", 54);
    \u0275\u0275elementStart(4, "div", 55);
    \u0275\u0275conditionalCreate(5, EventChatPopupComponent_ng_template_2_Conditional_5_Template, 5, 2, "div", 56);
    \u0275\u0275conditionalCreate(6, EventChatPopupComponent_ng_template_2_Conditional_6_Template, 2, 1, "p", 57)(7, EventChatPopupComponent_ng_template_2_Conditional_7_Template, 3, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, EventChatPopupComponent_ng_template_2_Conditional_8_Template, 3, 0, "span", 58);
    \u0275\u0275conditionalCreate(9, EventChatPopupComponent_ng_template_2_Conditional_9_Template, 3, 0, "button", 59);
    \u0275\u0275conditionalCreate(10, EventChatPopupComponent_ng_template_2_Conditional_10_Template, 8, 8, "div", 60);
    \u0275\u0275conditionalCreate(11, EventChatPopupComponent_ng_template_2_Conditional_11_Template, 5, 5, "div", 61);
    \u0275\u0275conditionalCreate(12, EventChatPopupComponent_ng_template_2_Conditional_12_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_21_0;
    const message_r17 = ctx.$implicit;
    const groupLabel_r35 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mine", message_r17.mine)("chat-message-fresh", ctx_r1.isFreshMessage(message_r17.id))("chat-message-pending", message_r17.deliveryState === "pending")("chat-message-timed-out", message_r17.deliveryState === "timed-out")("chat-message-selected", ctx_r1.selectedMessageId && ctx_r1.selectedMessageId === message_r17.id)("chat-message-highlighted", ctx_r1.highlightedMessageId && ctx_r1.highlightedMessageId === message_r17.id)("chat-message-deleted", message_r17.deletedAtIso);
    \u0275\u0275attribute("data-group-label", groupLabel_r35)("data-chat-message-id", message_r17.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(!message_r17.deletedAtIso && message_r17.replyTo ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!message_r17.deletedAtIso ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!message_r17.deletedAtIso ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.deletedAtIso ? 6 : 7);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!message_r17.deletedAtIso && message_r17.pinnedAtIso ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!message_r17.deletedAtIso && (message_r17.reactions ?? \u0275\u0275pureFunction0(25, _c4)).length > 0 ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.id && ctx_r1.selectedMessageId === message_r17.id && !message_r17.deletedAtIso ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r17.id && ctx_r1.quickReactionMessageId === message_r17.id ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = message_r17.id && !message_r17.deletedAtIso && ctx_r1.visibleReadReceiptsByMessageId[message_r17.id]) ? 12 : -1, tmp_21_0);
  }
}
function EventChatPopupComponent_Conditional_4_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 50);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_4_For_5_Template_button_click_0_listener() {
      const reaction_r38 = \u0275\u0275restoreView(_r37).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reactionDetailsFilter = reaction_r38.emoji);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reaction_r38 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", ctx_r1.reactionDetailsFilter === reaction_r38.emoji);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", reaction_r38.emoji, " ", reaction_r38.count);
  }
}
function EventChatPopupComponent_Conditional_4_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 117)(1, "span", 118);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "small");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 119);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const reaction_r39 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("user-color-" + reaction_r39.userGender);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(reaction_r39.userInitials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(reaction_r39.userName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Reacted with ", reaction_r39.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(reaction_r39.emoji);
  }
}
function EventChatPopupComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 114)(2, "button", 50);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.reactionDetailsFilter = "all");
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, EventChatPopupComponent_Conditional_4_For_5_Template, 2, 4, "button", 115, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 116);
    \u0275\u0275repeaterCreate(7, EventChatPopupComponent_Conditional_4_For_8_Template, 10, 6, "div", 117, _forTrack4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const reactionMessage_r40 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.reactionDetailsPopupModel())("zIndex", ctx_r1.chatDialogZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("active", ctx_r1.reactionDetailsFilter === "all");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("All ", (reactionMessage_r40.reactions == null ? null : reactionMessage_r40.reactions.length) ?? 0);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.reactionSummary(reactionMessage_r40));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.reactionDetailsRows(reactionMessage_r40));
  }
}
function EventChatPopupComponent_Conditional_5_For_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "check");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_Conditional_5_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 125);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_5_For_6_Template_button_click_0_listener($event) {
      const option_r43 = \u0275\u0275restoreView(_r42).$implicit;
      const pollContext_r44 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.selectPollOption(pollContext_r44.message, pollContext_r44.attachment, option_r43, $event));
    });
    \u0275\u0275elementStart(1, "span", 126);
    \u0275\u0275conditionalCreate(2, EventChatPopupComponent_Conditional_5_For_6_Conditional_2_Template, 2, 0, "mat-icon");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r43 = ctx.$implicit;
    const pollContext_r44 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-selected", ctx_r1.selectedPollOptionId(pollContext_r44.message, pollContext_r44.attachment) === option_r43.id);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.selectedPollOptionId(pollContext_r44.message, pollContext_r44.attachment) === option_r43.id ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r43.text);
  }
}
function EventChatPopupComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 120)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 121);
    \u0275\u0275repeaterCreate(5, EventChatPopupComponent_Conditional_5_For_6_Template, 5, 4, "button", 122, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "footer", 123)(8, "app-menu", 124);
    \u0275\u0275listener("itemSelect", function EventChatPopupComponent_Conditional_5_Template_app_menu_itemSelect_8_listener($event) {
      const pollContext_r44 = \u0275\u0275restoreView(_r41);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPollVoteActionSelect(pollContext_r44.message, pollContext_r44.attachment, $event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const pollContext_r44 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.pollVotePopupModel())("zIndex", ctx_r1.chatDialogZIndex());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(pollContext_r44.poll.question);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(pollContext_r44.poll.options);
    \u0275\u0275advance(3);
    \u0275\u0275property("items", ctx_r1.pollVoteActionMenuItems(pollContext_r44.message, pollContext_r44.attachment));
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "auto_awesome");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 69);
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", message_r46.senderAvatar.imageUrl, \u0275\u0275sanitizeUrl)("alt", message_r46.sender);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", message_r46.senderAvatar.initials, " ");
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_11_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 135);
    \u0275\u0275element(1, "img", 69);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const attachment_r47 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", attachment_r47.previewUrl || attachment_r47.url, \u0275\u0275sanitizeUrl)("alt", attachment_r47.title);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_11_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_6_For_3_Conditional_11_For_3_Conditional_0_Template, 2, 2, "span", 135);
  }
  if (rf & 2) {
    const attachment_r47 = ctx.$implicit;
    \u0275\u0275conditional(attachment_r47.type === "image" && (attachment_r47.previewUrl || attachment_r47.url) ? 0 : -1);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 134);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(2, EventChatPopupComponent_Conditional_6_For_3_Conditional_11_For_3_Template, 1, 1, null, null, _forTrack1);
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.chatAttachmentSummary(message_r46));
    \u0275\u0275advance();
    \u0275\u0275repeater(message_r46.attachments);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(message_r46.text);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_16_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reaction_r48 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", reaction_r48.emoji, " ", reaction_r48.count);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 132);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_Conditional_6_For_3_Conditional_16_For_2_Template, 2, 2, "span", null, _forTrack3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.reactionSummary(message_r46));
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 69);
  }
  if (rf & 2) {
    const reader_r49 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", reader_r49.imageUrl, \u0275\u0275sanitizeUrl)("alt", reader_r49.initials);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const reader_r49 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275textInterpolate1(" ", reader_r49.initials, " ");
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 113);
    \u0275\u0275conditionalCreate(1, EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Conditional_1_Template, 1, 2, "img", 69)(2, EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Conditional_2_Template, 1, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const reader_r49 = ctx.$implicit;
    \u0275\u0275classMap("user-color-" + reader_r49.gender);
    \u0275\u0275advance();
    \u0275\u0275conditional(reader_r49.imageUrl ? 1 : 2);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 133);
    \u0275\u0275repeaterCreate(1, EventChatPopupComponent_Conditional_6_For_3_Conditional_17_For_2_Template, 3, 3, "span", 136, \u0275\u0275componentInstance().trackByChatReader, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r46 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(message_r46.readBy);
  }
}
function EventChatPopupComponent_Conditional_6_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 129);
    \u0275\u0275listener("click", function EventChatPopupComponent_Conditional_6_For_3_Template_button_click_0_listener() {
      const message_r46 = \u0275\u0275restoreView(_r45).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectPinnedMessage(message_r46));
    });
    \u0275\u0275elementStart(1, "span", 68);
    \u0275\u0275conditionalCreate(2, EventChatPopupComponent_Conditional_6_For_3_Conditional_2_Template, 2, 0, "mat-icon")(3, EventChatPopupComponent_Conditional_6_For_3_Conditional_3_Template, 1, 2, "img", 69)(4, EventChatPopupComponent_Conditional_6_For_3_Conditional_4_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 130)(6, "span", 56)(7, "strong", 70);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 71);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(11, EventChatPopupComponent_Conditional_6_For_3_Conditional_11_Template, 4, 1);
    \u0275\u0275conditionalCreate(12, EventChatPopupComponent_Conditional_6_For_3_Conditional_12_Template, 2, 1, "span", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 131)(14, "mat-icon");
    \u0275\u0275text(15, "push_pin");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, EventChatPopupComponent_Conditional_6_For_3_Conditional_16_Template, 3, 0, "span", 132);
    \u0275\u0275conditionalCreate(17, EventChatPopupComponent_Conditional_6_For_3_Conditional_17_Template, 3, 0, "span", 133);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r46 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("user-color-" + message_r46.senderAvatar.gender);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r46.senderAvatar.gender === "system" ? 2 : message_r46.senderAvatar.imageUrl ? 3 : 4);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(message_r46.sender);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r46.time);
    \u0275\u0275advance();
    \u0275\u0275conditional((message_r46.attachments ?? \u0275\u0275pureFunction0(9, _c4)).length > 0 ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r46.text ? 12 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional((message_r46.reactions ?? \u0275\u0275pureFunction0(10, _c4)).length > 0 ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r46.readBy.length > 0 ? 17 : -1);
  }
}
function EventChatPopupComponent_Conditional_6_ForEmpty_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No pinned messages yet.");
    \u0275\u0275elementEnd();
  }
}
function EventChatPopupComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 6)(1, "div", 127);
    \u0275\u0275repeaterCreate(2, EventChatPopupComponent_Conditional_6_For_3_Template, 18, 11, "button", 128, _forTrack1, false, EventChatPopupComponent_Conditional_6_ForEmpty_4_Template, 2, 0, "p");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.pinnedMessagesPopupModel())("zIndex", ctx_r1.chatDialogZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pinnedMessages());
  }
}
function EventChatPopupComponent_Conditional_7_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventChatPopupComponent_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventChatPopupComponent_Conditional_7_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 137);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventChatPopupComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_7_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.eventSubeventsStore.eventSubeventsListPopupComponent()) ? 0 : -1, tmp_2_0);
  }
}
function EventChatPopupComponent_Conditional_8_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventChatPopupComponent_Conditional_8_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventChatPopupComponent_Conditional_8_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 138);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.resourcePopupOutletInputs());
  }
}
function EventChatPopupComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_8_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.resourcePopupStore.eventResourcePopupComponent()) ? 0 : -1, tmp_2_0);
  }
}
function EventChatPopupComponent_Conditional_9_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventChatPopupComponent_Conditional_9_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventChatPopupComponent_Conditional_9_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 138);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngComponentOutlet", ctx)("ngComponentOutletInputs", ctx_r1.assetExplorePopupOutletInputs());
  }
}
function EventChatPopupComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_9_Conditional_0_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.resourcePopupStore.eventResourceAssetExploreComponent()) ? 0 : -1, tmp_2_0);
  }
}
function EventChatPopupComponent_Conditional_10_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function EventChatPopupComponent_Conditional_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, EventChatPopupComponent_Conditional_10_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 137);
  }
  if (rf & 2) {
    \u0275\u0275property("ngComponentOutlet", ctx);
  }
}
function EventChatPopupComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_10_Conditional_0_Template, 1, 1, "ng-container");
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.resourcePopupStore.eventSupplyContributionsPopupComponent()) ? 0 : -1, tmp_2_0);
  }
}
var EventChatPopupComponent = class _EventChatPopupComponent {
  cdr = inject(ChangeDetectorRef);
  activitiesStore = inject(ActivitiesPopupStore);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  memberMenuStore = inject(MemberMenuStore);
  eventSubeventsStore = inject(EventSubeventsPopupStore);
  resourcePopupStore = inject(SubEventResourcePopupStore);
  chatsService = inject(ChatsService);
  activityResourcesService = inject(ActivityResourcesService);
  eventsService = inject(EventsService);
  shareTokensService = inject(ShareTokensService);
  chatVoiceClipsService = inject(ChatVoiceClipsService);
  dialogStore = inject(DialogStore);
  mediaService = inject(MediaService);
  profileStore = inject(ProfileStore);
  location = inject(Location);
  i18n = inject(I18nService);
  deploymentConfiguration = inject(DeploymentConfigurationService);
  pollCoordinator = inject(UiPollCoordinator);
  hostedSessionRef = signal(null, ...ngDevMode ? [{ debugName: "hostedSessionRef" }] : (
    /* istanbul ignore next */
    []
  ));
  hostedHeaderRef = signal(null, ...ngDevMode ? [{ debugName: "hostedHeaderRef" }] : (
    /* istanbul ignore next */
    []
  ));
  closeHostedChatHandler = null;
  set chatSession(session) {
    this.hostedSessionRef.set(session ?? null);
  }
  set chatHeader(header) {
    this.hostedHeaderRef.set(header ? this.cloneEventChatHeader(header) : null);
  }
  set closeHostedChat(handler) {
    this.closeHostedChatHandler = handler ?? null;
  }
  session = computed(() => {
    const hostedSession = this.hostedSessionRef();
    const session = hostedSession ?? this.activitiesStore.eventChatSession();
    const header = hostedSession ? this.hostedHeaderRef() : this.activitiesStore.eventChatHeader();
    if (!session || !header || `${session.request.chatId ?? ""}`.trim() !== `${header.chatId ?? ""}`.trim()) {
      return null;
    }
    return __spreadProps(__spreadValues({}, session), {
      item: this.chatFromHeader(header)
    });
  }, ...ngDevMode ? [{ debugName: "session" }] : (
    /* istanbul ignore next */
    []
  ));
  chatHeaderPollScheduler = new UiTaskScheduler({
    intervalMs: () => this.session() ? this.chatsService.pollIntervalMs() : 0,
    state: () => {
      const session = this.session();
      return {
        sessionKey: session ? `${session.item.id}:${session.openedAtIso}` : "",
        chatId: `${session?.item.id ?? ""}`.trim(),
        revision: Math.max(1, Math.trunc(Number(session?.item.revision) || 1))
      };
    },
    task: async ({ state, signal: signal2 }) => this.pollChatHeader(state, signal2),
    pollCoordinator: this.pollCoordinator,
    pollPriority: "foreground"
  });
  resourcePopupOutletInputs = computed(() => ({
    parentZIndex: this.currentChatPopupZIndex()
  }), ...ngDevMode ? [{ debugName: "resourcePopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  assetExplorePopupOutletInputs = computed(() => ({
    parentZIndex: this.currentChatPopupZIndex()
  }), ...ngDevMode ? [{ debugName: "assetExplorePopupOutletInputs" }] : (
    /* istanbul ignore next */
    []
  ));
  chatInitialLoadPending = false;
  messages = [];
  draftMessage = "";
  chatComposeDetachedSpace = 108;
  chatHeaderContext = null;
  selectedChatNavigationState = null;
  resolvedChatEventRecord = null;
  resolvedChatEventRecordKey = "";
  resolvedChatResourceState = null;
  resolvedChatResourceStateKey = "";
  resolvedChatGroupSnapshot = null;
  resolvedChatGroupSnapshotKey = "";
  lastAppliedActivityChatMetricBucketPatchUpdatedMs = 0;
  typingIndicators = [];
  voiceComposerOpen = false;
  voiceRecordingState = "idle";
  voiceRecorderSeconds = 0;
  voiceRecorderError = "";
  voiceClipDataUrl = "";
  voiceClipMimeType = "";
  voiceClipSizeBytes = 0;
  voiceAttachmentSrcByKey = {};
  pollComposerOpen = false;
  pollQuestionDraft = "";
  pollOptionDrafts = ["", ""];
  selectedPollOptionByMessageId = {};
  pollVoteMessageId = "";
  pollVoteAttachmentId = "";
  selectedMessageId = "";
  selectedMessageToolsDown = false;
  quickReactionMessageId = "";
  quickReactionOpenDown = false;
  reactionDetailsMessageId = "";
  reactionDetailsFilter = "all";
  pinnedDialogOpen = false;
  replyTarget = null;
  editingMessageId = "";
  highlightedMessageId = "";
  quickReactionEmojis = ["\u2764\uFE0F", "\u{1F606}", "\u{1F62E}", "\u{1F622}", "\u{1F621}", "\u{1F44D}"];
  emojiPickerCategories = [
    {
      key: "smileys",
      label: "Smileys & people",
      icon: "sentiment_satisfied",
      emojis: [
        "\u{1F600}",
        "\u{1F603}",
        "\u{1F604}",
        "\u{1F601}",
        "\u{1F606}",
        "\u{1F979}",
        "\u{1F602}",
        "\u{1F923}",
        "\u{1F972}",
        "\u{1F60A}",
        "\u263A\uFE0F",
        "\u{1F609}",
        "\u{1F60D}",
        "\u{1F970}",
        "\u{1F618}",
        "\u{1F617}",
        "\u{1F60B}",
        "\u{1F61B}",
        "\u{1F61D}",
        "\u{1F92A}",
        "\u{1F928}",
        "\u{1F9D0}",
        "\u{1F60E}",
        "\u{1F973}",
        "\u{1F61F}",
        "\u{1F622}",
        "\u{1F62D}",
        "\u{1F624}",
        "\u{1F621}",
        "\u{1F92F}",
        "\u{1F44D}",
        "\u{1F44E}",
        "\u{1F44F}",
        "\u{1F64C}",
        "\u{1F64F}",
        "\u{1F4AA}"
      ]
    },
    { key: "animals", label: "Animals & nature", icon: "pets", emojis: ["\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F438}", "\u{1F435}", "\u{1F332}", "\u{1F335}", "\u{1F33B}", "\u{1F319}"] },
    { key: "food", label: "Food & drink", icon: "restaurant", emojis: ["\u{1F34F}", "\u{1F34E}", "\u{1F34C}", "\u{1F353}", "\u{1F347}", "\u{1F349}", "\u{1F355}", "\u{1F354}", "\u{1F35F}", "\u{1F32E}", "\u{1F35C}", "\u{1F363}", "\u{1F370}", "\u2615", "\u{1F37A}", "\u{1F377}", "\u{1F942}", "\u{1F37D}\uFE0F"] },
    { key: "activity", label: "Activities", icon: "sports_soccer", emojis: ["\u26BD", "\u{1F3C0}", "\u{1F3C8}", "\u{1F3BE}", "\u{1F3D0}", "\u{1F3B1}", "\u{1F3D3}", "\u{1F3AF}", "\u{1F3AE}", "\u{1F3B2}", "\u{1F3B8}", "\u{1F3A4}", "\u{1F3AC}", "\u{1F3A8}", "\u{1F3C6}", "\u{1F389}", "\u2728", "\u{1F525}"] },
    { key: "travel", label: "Travel & places", icon: "directions_car", emojis: ["\u{1F697}", "\u{1F695}", "\u{1F68C}", "\u{1F68E}", "\u{1F3CE}\uFE0F", "\u{1F693}", "\u{1F691}", "\u{1F6B2}", "\u2708\uFE0F", "\u{1F686}", "\u{1F6A2}", "\u{1F3E0}", "\u{1F3D9}\uFE0F", "\u26F0\uFE0F", "\u{1F3D6}\uFE0F", "\u{1F30D}", "\u{1F9ED}", "\u{1F4CD}"] },
    { key: "objects", label: "Objects", icon: "lightbulb", emojis: ["\u{1F4A1}", "\u{1F4F1}", "\u{1F4BB}", "\u231A", "\u{1F4F7}", "\u{1F381}", "\u{1F511}", "\u{1F512}", "\u{1F4CC}", "\u{1F4CE}", "\u270F\uFE0F", "\u{1F4C5}", "\u{1F4AC}", "\u{1F514}", "\u2764\uFE0F", "\u{1F9E1}", "\u{1F499}", "\u{1F49C}"] },
    { key: "symbols", label: "Symbols", icon: "shuffle", emojis: ["\u2705", "\u2611\uFE0F", "\u274C", "\u26A0\uFE0F", "\u2757", "\u2753", "\u2795", "\u2796", "\u27A1\uFE0F", "\u2B05\uFE0F", "\u{1F504}", "\u{1F501}", "\u{1F4AF}", "\u{1F534}", "\u{1F7E2}", "\u{1F535}", "\u2B50", "\u{1F4CC}"] },
    { key: "flags", label: "Flags", icon: "flag", emojis: ["\u{1F3F3}\uFE0F", "\u{1F3F4}", "\u{1F3C1}", "\u{1F6A9}", "\u{1F1FA}\u{1F1F8}", "\u{1F1E8}\u{1F1E6}", "\u{1F1EC}\u{1F1E7}", "\u{1F1EE}\u{1F1EA}", "\u{1F1E9}\u{1F1EA}", "\u{1F1EB}\u{1F1F7}", "\u{1F1EA}\u{1F1F8}", "\u{1F1EE}\u{1F1F9}", "\u{1F1ED}\u{1F1FA}", "\u{1F1F8}\u{1F1F0}", "\u{1F1E8}\u{1F1FF}", "\u{1F1F5}\u{1F1F1}", "\u{1F1FA}\u{1F1E6}", "\u{1F1EA}\u{1F1FA}"] }
  ];
  chatHistoryPageSize = 10;
  chatInitialLoadMessageCount = 15;
  chatHistoryPreloadOffsetPx = 48;
  chatTypingIdleMs = 1800;
  chatTypingRemoteTtlMs = 3200;
  chatTransientFxMs = 1600;
  pendingMessageTimeoutMs = 3e3;
  pendingMessageMatchWindowMs = 45e3;
  chatThreadRevision = 0;
  chatThreadQuery = {};
  chatThreadSmartListConfig = {
    pageSize: this.chatHistoryPageSize,
    mobilePageSizeCap: null,
    initialPageCount: 1,
    initialPageSize: this.chatInitialLoadMessageCount,
    preloadOffsetPx: this.chatHistoryPreloadOffsetPx,
    showStickyHeader: false,
    showFirstGroupMarker: true,
    loadTriggerEdge: "end",
    mergeStrategy: "append",
    initialScrollAnchor: "start",
    listLayout: "thread",
    listFlow: "reverse",
    containerClass: ["chat-thread-list", "chat-thread-list--reverse"],
    groupMarkerClass: "chat-thread-group-marker",
    headerProgress: {
      enabled: true,
      tone: "chat",
      state: () => this.runtimeStore.isOnline() ? "active" : "inactive"
    },
    emptyLabel: () => this.chatInitialLoadPending ? "" : "No messages yet",
    emptyDescription: () => this.chatInitialLoadPending ? "" : "Start the conversation.",
    emptyStickyLabel: "",
    trackBy: (_index, message) => message.id,
    groupBy: (message) => this.chatDayLabel(new Date(message.sentAtIso))
  };
  chatThreadLoadPage = (query) => {
    const sessionKey = `${query.filters?.sessionKey ?? ""}`.trim();
    if (!sessionKey) {
      return of(this.emptyChatThreadPage());
    }
    return from(this.loadChatThreadPage(query, sessionKey));
  };
  chatThreadSmartList;
  messageTextarea;
  imageAttachmentInput;
  set chatComposeBoxElement(value) {
    this.chatComposeBoxRef = value;
    this.observeChatComposeBox();
  }
  loadedSessionKey = null;
  initialChatLoadedSessionKey = null;
  chatComposeBoxRef;
  chatComposeResizeObserver = null;
  liveChatUnsubscribe = null;
  typingIdleTimer = null;
  localTypingActive = false;
  visibleChatThreadTotal = 0;
  chatThreadKnownTotal = 0;
  latestVisibleReadMessageIdByReaderId = {};
  visibleReadReceiptsByMessageId = {};
  freshMessageIds = /* @__PURE__ */ new Set();
  freshReadKeys = /* @__PURE__ */ new Set();
  remoteTypingExpiryByUserId = {};
  pendingMessageTimeouts = /* @__PURE__ */ new Map();
  loadingVoiceClipKeys = /* @__PURE__ */ new Set();
  reactionMutationSequenceByMessageId = /* @__PURE__ */ new Map();
  pollVoteMutationSequenceByMessageId = /* @__PURE__ */ new Map();
  queuedReactionByPendingMessageId = /* @__PURE__ */ new Map();
  voiceRecorder = null;
  voiceRecorderStream = null;
  voiceRecorderChunks = [];
  voiceRecorderTimer = null;
  chatThreadScrollDismissElement = null;
  dismissMessageUiOnChatScroll = () => {
    if (!this.selectedMessageId && !this.quickReactionMessageId && !(this.chatThreadSmartList?.menuOpen() ?? false)) {
      return;
    }
    this.closeTransientMessageUi();
    this.cdr.markForCheck();
  };
  messageLongPressTimer = null;
  optimisticMessageSequence = 0;
  headerPollSessionKey = null;
  trackByChatReader = (_index, reader) => reader.id;
  constructor() {
    effect(() => {
      if (!this.shouldHostChatResourcePopup()) {
        return;
      }
      void this.resourcePopupStore.ensureEventResourcePopupLoaded();
    });
    effect(() => {
      if (!this.shouldHostChatResourcePopup() || !this.resourcePopupStore.assetExplorePopupRef()) {
        return;
      }
      void this.resourcePopupStore.ensureEventResourceAssetExploreLoaded();
    });
    effect(() => {
      if (!this.shouldHostChatSupplyContributionsPopup()) {
        return;
      }
      void this.resourcePopupStore.ensureEventSupplyContributionsPopupLoaded();
    });
    effect(() => {
      const patch = this.activityStore.activityChatMetricBucketPatch();
      if (!patch || patch.updatedMs <= this.lastAppliedActivityChatMetricBucketPatchUpdatedMs) {
        return;
      }
      this.lastAppliedActivityChatMetricBucketPatchUpdatedMs = patch.updatedMs;
      this.applySelectedChatMetricBucketPatch(patch);
    });
    effect(() => {
      const request = this.eventSubeventsStore.eventSubeventsListPopup();
      if (!request || request.host !== "chat" || !this.session()) {
        return;
      }
      void this.eventSubeventsStore.ensureEventSubeventsListPopupLoaded();
    });
    effect(() => {
      const session = this.session();
      const sessionKey = session ? `${session.item.id}:${session.openedAtIso}` : null;
      if (this.headerPollSessionKey !== sessionKey) {
        this.headerPollSessionKey = sessionKey;
        if (sessionKey) {
          this.chatHeaderPollScheduler.restart();
        } else {
          this.chatHeaderPollScheduler.stop({ abort: true });
        }
      }
      if (session && this.loadedSessionKey === sessionKey) {
        this.syncSelectedChatHeader(session.item);
        this.cdr.markForCheck();
        return;
      }
      this.teardownLiveChatUpdates();
      this.loadedSessionKey = sessionKey;
      this.initialChatLoadedSessionKey = null;
      this.draftMessage = "";
      this.closeTransientMessageUi();
      this.replyTarget = null;
      this.editingMessageId = "";
      this.chatThreadSmartList?.closeMenu();
      this.messages = [];
      this.typingIndicators = [];
      this.localTypingActive = false;
      this.clearTypingIdleTimer();
      this.clearRemoteTypingIndicators();
      this.clearTransientMessageState();
      this.clearPendingMessageTimers();
      this.resetVisibleReadReceipts();
      this.chatThreadRevision = 0;
      this.visibleChatThreadTotal = 0;
      this.chatThreadKnownTotal = 0;
      this.syncChatThreadQuery();
      if (!session) {
        this.loadedSessionKey = null;
        this.chatThreadQuery = {};
        this.chatInitialLoadPending = false;
        this.syncSelectedChatHeader(null);
        this.cdr.markForCheck();
        return;
      }
      this.syncSelectedChatHeader(session.item);
      this.chatInitialLoadPending = true;
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    this.chatHeaderPollScheduler.destroy();
    this.clearChatComposeResizeObserver();
    this.clearChatThreadScrollDismissListener();
    this.clearMessageLongPress();
    this.stopLocalTyping();
    this.resetVoiceRecorder();
    this.teardownLiveChatUpdates();
    this.clearPendingMessageTimers();
    this.visibleChatThreadTotal = 0;
    this.chatThreadKnownTotal = 0;
  }
  close() {
    this.chatHeaderPollScheduler.stop({ abort: true });
    this.headerPollSessionKey = null;
    this.chatThreadSmartList?.closeMenu();
    this.stopLocalTyping();
    this.resetVoiceRecorder();
    this.teardownLiveChatUpdates();
    this.clearPendingMessageTimers();
    this.visibleChatThreadTotal = 0;
    this.chatThreadKnownTotal = 0;
    this.loadedSessionKey = null;
    this.chatThreadQuery = {};
    this.closeTransientMessageUi();
    if (this.hostedSessionRef()) {
      this.closeHostedChatHandler?.();
      return;
    }
    this.resourcePopupStore.closeResourcePopup();
    if (this.isBlockedSupportChat()) {
      this.activitiesStore.closeActivities();
      return;
    }
    this.activitiesStore.closeEventChat();
  }
  chatPopupModel(chatSession) {
    const title = this.chatHeaderTitle(chatSession);
    const subtitle = this.selectedChatParentDisplayLabel(chatSession.item, this.selectedChatNavigationState);
    return {
      title,
      headerTitleBadge: this.chatHeaderContext?.titleBadge?.label ?? null,
      headerTitleBadgeTone: this.chatHeaderContext?.titleBadge?.tone ?? "neutral",
      subtitle: subtitle || void 0,
      ariaLabel: title,
      closeAriaLabel: "Close chat popup",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: this.chatPopupHeaderControls(),
      toolbarControls: this.chatPopupToolbarControls(),
      onClose: () => this.close(),
      onMenuSelect: (event) => this.onInlineChatMenuSelect(event.itemSelect)
    };
  }
  chatPopupZIndex(chatSession) {
    const parentZIndex = Number(chatSession.request.parentZIndex);
    return Number.isFinite(parentZIndex) && parentZIndex > 0 ? Math.trunc(parentZIndex) + 100 : 2360;
  }
  reactionDetailsPopupModel() {
    return {
      title: "Message reactions",
      ariaLabel: "Message reactions",
      closeAriaLabel: "Close reactions",
      closeOnBackdrop: true,
      size: "small",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: () => this.closeReactionDetails()
    };
  }
  createPollPopupModel() {
    return {
      title: "Create Poll",
      ariaLabel: "Create Poll",
      closeAriaLabel: "Cancel poll",
      closeOnBackdrop: true,
      size: "small",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: (event) => this.closePollComposer(event)
    };
  }
  pinnedMessagesPopupModel() {
    return {
      title: "Pinned messages",
      ariaLabel: "Pinned messages",
      closeAriaLabel: "Close pinned messages",
      closeOnBackdrop: true,
      size: "small",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: () => this.closePinnedMessagesDialog()
    };
  }
  pollVotePopupModel() {
    return {
      title: "Vote",
      ariaLabel: "Vote",
      closeAriaLabel: "Close poll",
      closeOnBackdrop: true,
      size: "small",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: () => this.closePollVoteDialog()
    };
  }
  chatDialogZIndex() {
    return this.currentChatPopupZIndex() + 10;
  }
  currentChatPopupZIndex() {
    const session = this.session();
    return session ? this.chatPopupZIndex(session) : 2360;
  }
  chatPopupHeaderControls() {
    if (this.isAppSupportChat() && !this.canShareWorkspaceWithSupport() || this.isServiceChat() || this.isBlockedSupportChat()) {
      return [];
    }
    if (this.selectedChatHasSubEventMenu()) {
      return [{
        kind: "menu",
        id: "chat-context-menu",
        menuKind: "select",
        title: this.selectedChatContextMenuTitle(),
        trigger: this.selectedChatContextMenuTrigger(),
        groups: this.selectedChatContextMenuGroupsModel(),
        panelAlign: "end"
      }];
    }
    return [{
      kind: "menu",
      id: "chat-context-primary",
      menuKind: "select",
      trigger: this.selectedChatPrimaryActionTrigger()
    }];
  }
  chatPopupToolbarControls() {
    return [{
      kind: "menu",
      id: "chat-header-actions",
      align: "end",
      menuKind: "inline",
      items: this.chatHeaderActionMenuItems(this.chatHeaderMembersControl())
    }];
  }
  selectedChatPrimaryControl() {
    return this.selectedChatContextControl() ?? {
      id: "fallback-event",
      label: "View Event",
      visual: { kind: "icon", icon: "event" }
    };
  }
  selectedChatPrimaryActionTrigger() {
    const control = this.selectedChatPrimaryControl();
    return {
      id: `chat-context-primary-${control.id}`,
      label: control.label,
      icon: this.chatHeaderControlIcon(control),
      palette: this.selectedChatHeaderActionPalette(),
      counter: this.chatHeaderControlBadgeValue(control),
      ariaLabel: this.chatHeaderControlLabel(control),
      layout: "pill",
      action: "custom",
      context: { menu: "chat-context", control }
    };
  }
  chatFromHeader(header) {
    const chatId = `${header.chatId ?? ""}`.trim();
    const ownerId = `${header.ownerId ?? ""}`.trim();
    const title = `${header.title ?? ""}`.trim() || "Chat";
    return {
      id: chatId || ownerId,
      avatar: `${header.avatar ?? ""}`.trim() || AppUtils.initialsFromText(title),
      title,
      lastMessage: `${header.lastMessage ?? ""}`.trim(),
      lastSenderId: `${header.lastSenderId ?? ""}`.trim(),
      memberIds: [...header.memberIds ?? []],
      members: (header.members ?? []).map((member) => __spreadValues({}, member)),
      unread: Math.max(0, Math.trunc(Number(header.unread) || 0)),
      dateIso: header.dateIso ?? void 0,
      channelType: header.channelType ?? void 0,
      ownerId: ownerId || void 0,
      eventId: `${header.eventId ?? ""}`.trim() || void 0,
      subEventId: `${header.subEventId ?? ""}`.trim() || void 0,
      groupId: `${header.groupId ?? ""}`.trim() || void 0,
      ownerStatus: header.ownerStatus ?? null,
      revision: Math.max(1, Math.trunc(Number(header.revision) || 1)),
      supportCase: header.supportCase ? __spreadValues({}, header.supportCase) : header.supportCase,
      ownerUserId: header.ownerUserId ?? null,
      metrics: header.metrics ? {
        members: header.metrics.members ? __spreadValues({}, header.metrics.members) : null,
        transport: header.metrics.transport ? __spreadValues({}, header.metrics.transport) : null,
        accommodation: header.metrics.accommodation ? __spreadValues({}, header.metrics.accommodation) : null,
        supplies: header.metrics.supplies ? __spreadValues({}, header.metrics.supplies) : null,
        groupsCount: header.metrics.groupsCount ?? null,
        pendingTotal: Math.max(0, Math.trunc(Number(header.metrics.pendingTotal) || 0))
      } : header.metrics,
      navigationContext: header.navigationContext ? __spreadProps(__spreadValues({}, header.navigationContext), {
        subEvent: __spreadValues({}, header.navigationContext.subEvent),
        group: header.navigationContext.group ? __spreadValues({}, header.navigationContext.group) : header.navigationContext.group
      }) : header.navigationContext
    };
  }
  cloneEventChatHeader(header) {
    return __spreadProps(__spreadValues({}, header), {
      chatId: `${header.chatId ?? ""}`.trim(),
      ownerId: `${header.ownerId ?? ""}`.trim() || null,
      parentZIndex: Number.isFinite(Number(header.parentZIndex)) ? Math.max(0, Math.trunc(Number(header.parentZIndex))) : null,
      memberIds: [...header.memberIds ?? []],
      members: (header.members ?? []).map((member) => __spreadValues({}, member)),
      supportCase: header.supportCase ? __spreadProps(__spreadValues({}, header.supportCase), {
        assignee: header.supportCase.assignee ? __spreadValues({}, header.supportCase.assignee) : header.supportCase.assignee
      }) : header.supportCase,
      metrics: header.metrics ? {
        members: header.metrics.members ? __spreadValues({}, header.metrics.members) : null,
        transport: header.metrics.transport ? __spreadValues({}, header.metrics.transport) : null,
        accommodation: header.metrics.accommodation ? __spreadValues({}, header.metrics.accommodation) : null,
        supplies: header.metrics.supplies ? __spreadValues({}, header.metrics.supplies) : null,
        groupsCount: header.metrics.groupsCount ?? null,
        pendingTotal: Math.max(0, Math.trunc(Number(header.metrics.pendingTotal) || 0))
      } : header.metrics,
      navigationContext: header.navigationContext ? __spreadProps(__spreadValues({}, header.navigationContext), {
        subEvent: __spreadValues({}, header.navigationContext.subEvent),
        group: header.navigationContext.group ? __spreadValues({}, header.navigationContext.group) : header.navigationContext.group
      }) : header.navigationContext
    });
  }
  patchCurrentEventChatHeader(headerUpdater) {
    const hostedHeader = this.hostedHeaderRef();
    if (this.hostedSessionRef() && hostedHeader) {
      this.hostedHeaderRef.set(this.cloneEventChatHeader(headerUpdater(this.cloneEventChatHeader(hostedHeader))));
      return;
    }
    this.activitiesStore.patchEventChatHeader(headerUpdater);
  }
  async pollChatHeader(state, signal2) {
    if (!state.chatId || !state.sessionKey) {
      return;
    }
    const result = await this.chatsService.syncChatHeader(state.chatId, state.revision, signal2);
    const current = this.session();
    const currentSessionKey = current ? `${current.item.id}:${current.openedAtIso}` : "";
    if (!current || currentSessionKey !== state.sessionKey || !result.changed) {
      return;
    }
    const synchronizedChat = __spreadProps(__spreadValues({}, current.item), {
      ownerStatus: result.ownerStatus ?? current.item.ownerStatus ?? null,
      revision: result.revision
    });
    const synchronizedHeader = eventChatHeaderStateFromChat(synchronizedChat);
    this.patchCurrentEventChatHeader((header) => __spreadProps(__spreadValues(__spreadValues({}, header), synchronizedHeader), {
      parentZIndex: header.parentZIndex
    }));
    this.activitiesStore.emitEventChatRowPatch({
      chatId: synchronizedChat.id,
      ownerId: synchronizedChat.ownerId ?? null,
      channelType: synchronizedChat.channelType ?? null,
      ownerStatus: synchronizedChat.ownerStatus ?? null,
      headerRevision: synchronizedChat.revision ?? result.revision
    });
    this.syncSelectedChatHeader(synchronizedChat);
    this.cdr.markForCheck();
  }
  chatHeaderTitle(chatSession) {
    return `${this.chatHeaderContext?.title ?? chatSession.item.title ?? ""}`.trim() || "Chat";
  }
  chatHeaderMembersControl() {
    const controls = this.chatHeaderContext?.controls ?? [];
    return controls.find((control) => control.id === "members") ?? null;
  }
  selectedChatContextControl() {
    const controls = this.chatHeaderContext?.controls ?? [];
    return controls.find((control) => control.id === "chat-context") ?? null;
  }
  chatHeaderControlIcon(control) {
    return control.visual?.kind === "icon" ? control.visual.icon : "groups";
  }
  chatHeaderControlLabel(control) {
    return `${control.summary ?? control.label ?? ""}`.trim() || "Members";
  }
  chatHeaderThumbs(control) {
    if (control.visual?.kind !== "thumbStack") {
      return [];
    }
    const maxVisible = Math.max(1, Math.trunc(Number(control.visual.maxVisible) || 4));
    return control.visual.thumbs.slice(0, maxVisible).map((thumb) => __spreadProps(__spreadValues({}, thumb), {
      imageUrl: AppUtils.mediaImageVariantUrl(thumb.imageUrl, "small") || null
    }));
  }
  chatHeaderControlBadgeValue(control) {
    return Math.max(0, Math.trunc(Number(control.badge?.value) || 0));
  }
  chatHeaderActionMenuItems(control) {
    return [
      ...control ? [this.chatHeaderMembersMenuItem(control)] : [],
      this.chatHeaderPinMenuItem()
    ];
  }
  chatHeaderMembersMenuItem(control) {
    const badgeValue = this.chatHeaderControlBadgeValue(control);
    const thumbStack = control.visual?.kind === "thumbStack" ? this.chatHeaderThumbs(control).map((thumb) => this.chatHeaderThumbStackItem(thumb)) : [];
    return {
      id: `chat-header-${control.id}`,
      label: control.visual?.kind === "thumbStack" ? null : this.chatHeaderControlLabel(control),
      icon: control.visual?.kind === "thumbStack" ? null : this.chatHeaderControlIcon(control),
      layout: control.visual?.kind === "thumbStack" ? "image-stack" : "action",
      palette: "blue",
      imageStack: thumbStack,
      imageStackMaxVisible: control.visual?.kind === "thumbStack" ? control.visual.maxVisible : null,
      counter: badgeValue > 0 ? this.chatHeaderControlCounterLabel(badgeValue) : null,
      ariaLabel: this.chatHeaderControlLabel(control),
      context: { menu: "chat-header", action: "members", control }
    };
  }
  chatHeaderPinMenuItem() {
    return {
      id: "chat-header-pins",
      icon: "push_pin",
      palette: this.pinnedMessages().length > 0 ? "blue" : "default",
      active: this.pinnedMessages().length > 0,
      ariaLabel: "Open pinned messages",
      context: { menu: "chat-header", action: "pins" }
    };
  }
  chatHeaderThumbStackItem(thumb) {
    return {
      id: thumb.id,
      imageUrl: thumb.imageUrl,
      imageAlt: thumb.label || thumb.initials,
      imageFallback: thumb.initials
    };
  }
  chatHeaderControlCounterLabel(value) {
    const count = Math.max(0, Math.trunc(Number(value) || 0));
    if (count <= 0) {
      return "";
    }
    return count > 99 ? "+99+" : `+${count}`;
  }
  openChatHeaderControl(control, event) {
    event?.stopPropagation();
    if (control.id !== "members") {
      return;
    }
    const lookup = control.lookup;
    const ownerId = `${lookup?.id ?? ""}`.trim();
    if (!ownerId) {
      return;
    }
    const session = this.session();
    const memberCount = Math.max(0, session?.item.memberIds?.length ?? session?.item.members?.length ?? 0);
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId,
      subtitle: this.chatHeaderContext?.title ?? this.session()?.item.title ?? "Chat",
      viewOnly: true,
      acceptedMembers: memberCount,
      pendingMembers: 0,
      capacityTotal: memberCount,
      lookup: lookup ? __spreadValues({}, lookup) : void 0
    });
  }
  isBlockedSupportChat() {
    const chat = this.session()?.item;
    return chat?.id.startsWith("c-support-blocked-") === true || chat?.supportCase?.status === "blocked";
  }
  isServiceChat() {
    const chat = this.session()?.item;
    if (chat?.channelType === "appSupport") {
      return false;
    }
    return chat?.channelType === "serviceEvent" || chat?.channelType === "supportCase" || Boolean(chat?.supportCase);
  }
  isAppSupportChat() {
    return this.session()?.item.channelType === "appSupport";
  }
  canShareWorkspaceWithSupport() {
    return this.isAppSupportChat() && !this.userProfileStore.activeUserIsAdmin();
  }
  shouldHostChatResourcePopup() {
    if (this.hostedSessionRef()) {
      return false;
    }
    const request = this.memberMenuStore.activitiesNavigationRequest();
    return Boolean(this.session()) && (request?.type === "chatResource" || request?.type === "assetExplore" || this.resourcePopupStore.popupContextRef()?.origin === "chat" || this.shouldHostChatSubEventResourcePopup());
  }
  shouldHostChatSupplyContributionsPopup() {
    return this.shouldHostChatResourcePopup() && !this.resourcePopupStore.assetExploreOnlyRef() && this.resourcePopupStore.supplyPopupRef() !== null;
  }
  shouldHostChatSubEventResourcePopup() {
    if (this.eventSubeventsStore.eventSubeventsListPopup()?.host === "chat") {
      return false;
    }
    const request = this.resourcePopupStore.subEventResourcePopupRequest();
    if (request && this.isSelectedChatSubEventResourceRequest(request)) {
      return true;
    }
    const context = this.resourcePopupStore.popupContextRef();
    return context?.origin === "subEventResource" && this.isSelectedChatResourceTarget(context.ownerId, context.subEvent.id);
  }
  isSelectedChatSubEventResourceRequest(request) {
    return this.isSelectedChatResourceTarget(request.ownerId, `${request.subEventId ?? ""}`);
  }
  isSelectedChatResourceTarget(ownerId, subEventId) {
    const session = this.session();
    const state = this.selectedChatNavigationState;
    const ownerParts = this.chatOwnerParts(session?.item ?? null);
    const selectedOwnerId = `${state?.eventId ?? ownerParts.eventId}`.trim();
    const selectedSubEventId = `${state?.subEvent?.id ?? ownerParts.subEventId}`.trim();
    return !!selectedOwnerId && !!selectedSubEventId && `${ownerId ?? ""}`.trim() === selectedOwnerId && `${subEventId ?? ""}`.trim() === selectedSubEventId;
  }
  selectedChatHasSubEventMenu() {
    const menu = this.selectedChatContextControl()?.menu;
    return Array.isArray(menu?.groups) && menu.groups.some((group) => group.controls.length > 0);
  }
  selectedChatHeaderActionIcon() {
    if (this.isServiceChat()) {
      return "support_agent";
    }
    return this.chatHeaderControlIcon(this.selectedChatContextControl() ?? {
      id: "fallback-event",
      label: "View Event",
      visual: { kind: "icon", icon: "event" }
    });
  }
  selectedChatHeaderActionLabel() {
    if (this.isServiceChat()) {
      return "Service";
    }
    return this.selectedChatContextControl()?.label ?? "View Event";
  }
  selectedChatHeaderActionBadgeCount() {
    return this.chatHeaderControlBadgeValue(this.selectedChatContextControl() ?? {
      id: "fallback-event",
      label: "View Event"
    });
  }
  selectedChatContextMenuTitle() {
    return this.selectedChatContextControl()?.menu?.title ?? this.session()?.item.title ?? "Chat";
  }
  selectedChatContextMenuTrigger() {
    return {
      label: this.selectedChatHeaderActionLabel(),
      icon: this.selectedChatHeaderActionIcon(),
      palette: this.selectedChatHeaderActionPalette(),
      counter: this.selectedChatHeaderActionBadgeCount(),
      ariaLabel: "Open chat context menu",
      layout: "pill"
    };
  }
  selectedChatContextMenuGroupsModel() {
    return this.selectedChatContextMenuGroups().map((group) => ({
      id: group.id,
      label: group.label,
      items: group.controls.map((control) => this.chatContextControlMenuItem(control))
    })).filter((group) => group.items.length > 0);
  }
  composerMenuTrigger() {
    return {
      icon: "add",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: "blue",
      ariaLabel: "Open chat tools"
    };
  }
  composerMenuItems() {
    return [
      { id: "chat-composer-image", label: "Upload image", icon: "image", palette: "sky", surface: "tinted", context: { menu: "composer", action: "image" } },
      { id: "chat-composer-voice", label: "Send a voice clip", icon: "mic", palette: "violet", surface: "tinted", context: { menu: "composer", action: "voice" } },
      { id: "chat-composer-poll", label: "Create a poll", icon: "poll", palette: "green", surface: "tinted", context: { menu: "composer", action: "poll" } },
      { id: "chat-composer-event", label: "Share event", icon: "event", palette: "blue", surface: "tinted", context: { menu: "composer", action: "event" } },
      { id: "chat-composer-asset", label: "Share asset", icon: "inventory_2", palette: "brown", surface: "tinted", context: { menu: "composer", action: "asset" } }
    ];
  }
  onInlineChatMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.menu === "chat-header") {
      if (context.action === "members") {
        this.openChatHeaderControl(context.control, event.sourceEvent);
        return;
      }
      this.openPinnedMessagesDialog(event.sourceEvent);
      return;
    }
    if (context.menu === "chat-context") {
      this.openSelectedChatMenuControl(context.control, event.sourceEvent);
      return;
    }
    if (context.menu === "composer") {
      switch (context.action) {
        case "image":
          this.openImageAttachmentPicker(event.sourceEvent);
          break;
        case "voice":
          this.openVoiceComposer(event.sourceEvent);
          break;
        case "poll":
          this.openPollComposer(event.sourceEvent);
          break;
        case "event":
          this.shareCurrentEvent(event.sourceEvent);
          break;
        case "asset":
          this.shareFirstAvailableAsset(event.sourceEvent);
          break;
      }
    }
  }
  messageActionMenuIdFor(message) {
    return `chat-message-action:${message.id}`;
  }
  messageActionMenuTrigger(message) {
    return {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: message.mine ? "blue" : "default",
      ariaLabel: "More message actions"
    };
  }
  messageActionMenuItems(message) {
    const items = [];
    if (this.messageHasViewableAttachment(message)) {
      items.push({
        id: `chat-message-view-${message.id}`,
        label: "View",
        icon: "visibility",
        context: { menu: "message-action", message, action: "view" }
      });
    }
    items.push({
      id: `chat-message-reply-${message.id}`,
      label: "Reply",
      icon: "reply",
      context: { menu: "message-action", message, action: "reply" }
    });
    if (message.mine && !message.deletedAtIso) {
      items.push({
        id: `chat-message-edit-${message.id}`,
        label: "Edit",
        icon: "edit",
        palette: "blue",
        surface: "tinted",
        context: { menu: "message-action", message, action: "edit" }
      });
      items.push({
        id: `chat-message-unsend-${message.id}`,
        label: "Unsend",
        icon: "delete",
        palette: "danger",
        surface: "tinted",
        context: { menu: "message-action", message, action: "unsend" }
      });
    }
    items.push({
      id: `chat-message-pin-${message.id}`,
      label: message.pinnedAtIso ? "Unpin" : "Pin",
      icon: message.pinnedAtIso ? "push_pin" : "push_pin",
      palette: message.pinnedAtIso ? "muted" : "amber",
      surface: "tinted",
      context: { menu: "message-action", message, action: "pin" }
    });
    if (this.canReportMessage(message)) {
      items.push({
        id: `chat-message-report-${message.id}`,
        label: "Report",
        icon: "flag",
        palette: "danger",
        surface: "tinted",
        context: { menu: "message-action", message, action: "report" }
      });
    }
    return items;
  }
  onDispatchedChatMenuSelect(event) {
    const emojiContext = event.context;
    if (emojiContext?.menu === "emoji-reaction") {
      const message = this.messages.find((item) => item.id === this.quickReactionMessageId);
      if (message) {
        this.toggleReaction(message, emojiContext.emoji, event.sourceEvent);
      } else {
        this.closeTransientMessageUi();
      }
      return;
    }
    const context = event.context;
    if (context?.menu !== "message-action") {
      return;
    }
    switch (context.action) {
      case "view":
        this.viewSharedMessage(context.message, event.sourceEvent);
        break;
      case "reply":
        this.setReplyTarget(context.message, event.sourceEvent);
        break;
      case "edit":
        this.beginEditMessage(context.message, event.sourceEvent);
        break;
      case "unsend":
        this.unsendMessage(context.message, event.sourceEvent);
        break;
      case "pin":
        this.togglePinMessage(context.message, event.sourceEvent);
        break;
      case "report":
        this.reportMessage(context.message, event.sourceEvent);
        break;
    }
  }
  isMobileView() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 760px)").matches;
  }
  openSelectedChatEvent(event) {
    this.openSelectedChatSubeventsPopup(event);
  }
  openSelectedChatPrimaryContext(event) {
    if (this.isServiceChat()) {
      event?.stopPropagation();
      return;
    }
    const channelType = this.selectedChatNavigationState?.channelType;
    if (channelType === "groupSubEvent") {
      this.openSelectedChatGroup(event);
      return;
    }
    if (channelType === "optionalSubEvent") {
      this.openSelectedChatSubEvent(event);
      return;
    }
    this.openSelectedChatEvent(event);
  }
  openSelectedChatSubEvent(event) {
    this.openSelectedChatSubeventsPopup(event);
  }
  openSelectedChatGroup(event) {
    event?.stopPropagation();
    this.openSelectedChatSubEvent();
  }
  openSelectedChatSubeventsPopup(event) {
    event?.stopPropagation();
    this.chatThreadSmartList?.closeMenu();
    const session = this.session();
    const state = this.selectedChatNavigationState;
    const eventId = `${state?.eventId ?? this.chatOwnerParts(session?.item ?? null).eventId}`.trim();
    if (!eventId) {
      return;
    }
    const record = this.selectedChatEventRecord(eventId);
    this.eventSubeventsStore.openEventSubeventsListPopup({
      eventId,
      host: "chat",
      target: this.selectedChatEventEditorTarget(record, state),
      title: record?.title ?? state?.eventTitle ?? session?.item.title ?? null,
      timeframe: record?.timeframe ?? null,
      startAtIso: record?.startAtIso ?? null,
      endAtIso: record?.endAtIso ?? null,
      mode: record?.mode ?? null,
      acceptedMembers: state?.metrics?.members?.accepted ?? record?.acceptedMembers,
      pendingMembers: state?.metrics?.members?.pending ?? state?.eventPendingMembers ?? record?.pendingMembers,
      capacityTotal: state?.metrics?.members?.capacityMax ?? record?.capacityTotal,
      resourceOwnerUserId: record?.creatorUserId ?? null,
      editorAction: this.selectedChatEventEditorAction(record, state)
    });
  }
  openSelectedChatSubEventResource(type, event, openExplore = false, assetViewId) {
    event?.stopPropagation();
    const session = this.session();
    const state = this.selectedChatNavigationState;
    if (!session || !state?.subEvent) {
      return;
    }
    const popupHeader = this.selectedChatResourcePopupHeader(session, state);
    this.chatThreadSmartList?.closeMenu();
    if (type === "Members" && !openExplore && !assetViewId) {
      this.openSelectedChatMembers(session, state);
      return;
    }
    if (!openExplore && !assetViewId) {
      const ownerId = `${state.eventId ?? this.chatOwnerParts(session.item).eventId}`.trim();
      const subEventId = `${state.subEvent.id ?? ""}`.trim();
      if (!ownerId || !subEventId) {
        return;
      }
      this.resourcePopupStore.requestSubEventResourcePopup({
        type,
        ownerId,
        parentTitle: `${state.eventTitle ?? session.item.title ?? ""}`.trim() || session.item.title,
        subEventId,
        popupHeader,
        subEventHeader: {
          name: state.subEvent.name,
          title: state.subEvent.name,
          description: state.subEvent.description,
          location: state.subEvent.location,
          startAt: state.subEvent.startAt,
          endAt: state.subEvent.endAt
        },
        group: this.selectedChatResourceRequestGroup(type)
      });
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "chatResource",
      ownerId: state.eventId ?? this.chatOwnerParts(session.item).eventId,
      item: session.item,
      resourceType: type,
      subEvent: state.subEvent,
      popupHeader,
      assetAssignmentIds: state.assetAssignmentIds,
      assetCardsByType: state.assetCardsByType,
      openExplore,
      assetViewId,
      group: state.group ? {
        id: state.group.id,
        groupLabel: state.group.label
      } : null
    });
  }
  selectedChatResourcePopupHeader(session, state) {
    const eventTitle = `${state.eventTitle ?? session.item.title ?? ""}`.trim();
    const subEventTitle = `${state.subEvent?.name ?? ""}`.trim();
    return {
      title: this.joinDistinctHeaderLabels([eventTitle, subEventTitle]) || eventTitle || "Event",
      subtitle: this.resourcePopupDateRangeLabel(state.subEvent?.startAt, state.subEvent?.endAt) || null
    };
  }
  resourcePopupDateRangeLabel(startAtIso, endAtIso) {
    return AppUtils.dateTimeRangeLabel(startAtIso, endAtIso, "");
  }
  joinDistinctHeaderLabels(parts) {
    const seen = /* @__PURE__ */ new Set();
    const labels = [];
    for (const part of parts) {
      const value = `${part ?? ""}`.trim();
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) {
        continue;
      }
      seen.add(key);
      labels.push(value);
    }
    return labels.join(" - ");
  }
  openSelectedChatMembers(session, state) {
    const ownerId = `${session.item.ownerId ?? ""}`.trim();
    if (!ownerId) {
      return;
    }
    const canManage = this.canEditSelectedChatEvent(this.selectedChatEventRecord(`${state.eventId ?? ""}`), state);
    const summary = this.selectedChatMembersSummary(state);
    const ownerType = this.selectedChatMembersOwnerType(state);
    const parentOwnerId = ownerType === "event" ? "" : `${state.eventId ?? ""}`.trim();
    this.memberMenuStore.requestActivitiesNavigation({
      type: "members",
      ownerId,
      ownerType,
      parentOwnerId: parentOwnerId || void 0,
      parentOwnerType: parentOwnerId ? "event" : void 0,
      eventId: parentOwnerId || void 0,
      subEventId: `${state.subEvent?.id ?? ""}`.trim() || void 0,
      subtitle: this.selectedChatMembersSubtitle(session, state),
      canManage,
      viewOnly: state.channelType === "groupSubEvent" ? !canManage : void 0,
      acceptedMembers: summary.acceptedMembers,
      pendingMembers: summary.pendingMembers,
      capacityTotal: summary.capacityTotal,
      metricIdentity: this.chatMetricIdentity(session.item)
    });
  }
  selectedChatMembersOwnerType(state) {
    if (state.channelType === "groupSubEvent") {
      return "group";
    }
    if (state.channelType === "optionalSubEvent") {
      return "subEvent";
    }
    return "event";
  }
  selectedChatMembersSubtitle(session, state) {
    if (state.channelType === "groupSubEvent") {
      const groupLabel = this.selectedChatGroupDisplayLabel(session.item, state);
      const subEventName = `${state.subEvent?.name ?? ""}`.trim();
      return [groupLabel, subEventName].filter((part, index, parts) => part && parts.indexOf(part) === index).join(" \xB7 ") || "Members";
    }
    return `${state.subEvent?.name ?? state.eventTitle ?? session.item.title ?? ""}`.trim() || "Members";
  }
  selectedChatMembersSummary(state) {
    const bucket = state.metrics?.members ?? null;
    const acceptedMembers = this.chatCountValue(bucket?.accepted ?? state.group?.accepted ?? state.subEvent?.membersAccepted);
    const pendingMembers = this.chatCountValue(bucket?.pending ?? state.group?.pending ?? state.subEvent?.membersPending);
    const capacityTotal = Math.max(acceptedMembers, this.chatCountValue(bucket?.capacityMax ?? state.group?.capacityMax ?? state.subEvent?.capacityMax));
    return {
      acceptedMembers,
      pendingMembers,
      capacityTotal
    };
  }
  selectedChatResourceRequestGroup(type) {
    const state = this.selectedChatNavigationState;
    const group = state?.group;
    if (!state || !group) {
      return null;
    }
    return {
      id: group.id,
      groupLabel: group.label,
      source: group.source ?? null,
      accepted: group.accepted,
      pending: group.pending,
      capacityMin: group.capacityMin,
      capacityMax: group.capacityMax,
      canManage: type === "Members" ? this.canEditSelectedChatEvent(this.selectedChatEventRecord(`${state.eventId ?? ""}`), state) : void 0
    };
  }
  selectedChatContextMenuGroups() {
    return this.selectedChatContextControl()?.menu?.groups?.map((group) => __spreadProps(__spreadValues({}, group), {
      controls: group.controls.map((control) => __spreadValues({}, control))
    })) ?? [];
  }
  selectedChatMenuControlIcon(control) {
    return this.chatHeaderControlIcon(control);
  }
  selectedChatMenuControlBadgeCount(control) {
    return this.chatHeaderControlBadgeValue(control);
  }
  openSelectedChatMenuControl(control, event) {
    event?.stopPropagation();
    if (control.id === "app-support-share-workspace") {
      void this.shareCurrentWorkspaceWithSupport();
      return;
    }
    const resourceType = this.popupControlResourceType(control);
    if (resourceType) {
      this.openSelectedChatSubEventResource(resourceType, event);
      return;
    }
    this.openSelectedChatPrimaryContext(event);
  }
  onDraftMessageChange(value) {
    this.draftMessage = value;
    this.resizeComposerTextarea();
    const session = this.session();
    if (!session || this.chatInitialLoadPending) {
      return;
    }
    const hasText = value.trim().length > 0;
    if (!hasText) {
      this.stopLocalTyping();
      return;
    }
    if (!this.localTypingActive) {
      this.localTypingActive = true;
      void this.chatsService.sendChatTyping(session.item, true);
    }
    this.clearTypingIdleTimer();
    this.typingIdleTimer = setTimeout(() => {
      this.stopLocalTyping();
    }, this.chatTypingIdleMs);
  }
  typingIndicatorLabel() {
    if (this.typingIndicators.length === 0) {
      return "";
    }
    if (this.typingIndicators.length === 1) {
      return `${this.typingIndicators[0].userName || this.typingIndicators[0].userInitials} is typing`;
    }
    return "Several people are typing";
  }
  isFreshMessage(messageId) {
    return this.freshMessageIds.has(messageId);
  }
  isFreshRead(messageId, readerId) {
    return this.freshReadKeys.has(`${messageId}:${readerId}`);
  }
  onComposerKeydown(event) {
    if (event.key !== "Enter" || event.shiftKey || this.isMobileInputMode()) {
      return;
    }
    event.preventDefault();
    this.sendMessage();
  }
  resizeComposerTextarea() {
    const textarea = this.messageTextarea?.nativeElement;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight) || 20;
    textarea.style.height = `${Math.min(textarea.scrollHeight, Math.round(lineHeight * 6))}px`;
  }
  composerEmojiSuggestions() {
    if (this.chatInitialLoadPending || this.voiceComposerOpen || this.pollComposerOpen) {
      return [];
    }
    return AppUtils.asciiEmojiSuggestionsForToken(AppUtils.trailingAsciiEmojiToken(this.draftMessage), 6);
  }
  applyComposerEmojiSuggestion(suggestion, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.onDraftMessageChange(AppUtils.replaceTrailingAsciiEmojiToken(this.draftMessage, suggestion.emoji));
    this.focusComposerSoon();
    this.resizeComposerTextareaSoon();
  }
  openImageAttachmentPicker(event) {
    event?.stopPropagation();
    this.imageAttachmentInput?.nativeElement.click();
  }
  openVoiceComposer(event) {
    event?.stopPropagation();
    this.pollComposerOpen = false;
    this.voiceComposerOpen = true;
    this.voiceRecorderError = "";
  }
  openPollComposer(event) {
    event?.stopPropagation();
    this.resetVoiceRecorder();
    this.pollComposerOpen = true;
    if (this.pollOptionDrafts.length < 2) {
      this.pollOptionDrafts = ["", ""];
    }
  }
  closePollComposer(event) {
    event?.stopPropagation();
    this.pollComposerOpen = false;
    this.pollQuestionDraft = "";
    this.pollOptionDrafts = ["", ""];
  }
  addPollOption(event) {
    event?.stopPropagation();
    if (this.pollOptionDrafts.length >= 6) {
      return;
    }
    this.pollOptionDrafts = [...this.pollOptionDrafts, ""];
  }
  removePollOption(index, event) {
    event?.stopPropagation();
    if (this.pollOptionDrafts.length <= 2) {
      this.pollOptionDrafts = this.pollOptionDrafts.map((value, valueIndex) => valueIndex === index ? "" : value);
      return;
    }
    this.pollOptionDrafts = this.pollOptionDrafts.filter((_value, valueIndex) => valueIndex !== index);
  }
  pollDraftOptionTrack(index) {
    return index;
  }
  canCreatePoll() {
    return this.pollQuestionDraft.trim().length > 0 && this.pollOptionDrafts.filter((option) => option.trim().length > 0).length >= 2 && !this.chatInitialLoadPending;
  }
  sendPoll(event) {
    event?.stopPropagation();
    if (!this.canCreatePoll()) {
      return;
    }
    const question = this.pollQuestionDraft.trim();
    const options = this.pollOptionDrafts.map((option) => option.trim()).filter(Boolean).slice(0, 6);
    this.closePollComposer();
    const pollId = `poll:${this.activeUserId() || "self"}:${Date.now()}`;
    const pollState = {
      question,
      options: options.map((option, index) => ({
        id: `${pollId}:option:${index + 1}`,
        text: option,
        votes: []
      }))
    };
    this.sendLocalAttachmentMessage({
      id: pollId,
      type: "poll",
      title: pollState.question,
      description: this.serializePollState(pollState)
    }, "");
  }
  async startVoiceRecording(event) {
    event?.stopPropagation();
    if (this.voiceRecordingState === "recording" || this.voiceRecordingState === "saving") {
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      this.voiceRecorderError = "Voice recording is not available on this device.";
      return;
    }
    this.resetVoiceRecorder({ keepOpen: true });
    this.voiceComposerOpen = true;
    this.voiceRecordingState = "recording";
    this.voiceRecorderError = "";
    this.cdr.markForCheck();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, this.preferredVoiceRecorderOptions());
      this.voiceRecorderStream = stream;
      this.voiceRecorder = recorder;
      this.voiceClipMimeType = recorder.mimeType || "audio/webm";
      recorder.ondataavailable = (dataEvent) => {
        if (dataEvent.data.size > 0) {
          this.voiceRecorderChunks.push(dataEvent.data);
        }
      };
      recorder.onstop = () => {
        void this.finalizeVoiceRecording();
      };
      recorder.start();
      this.voiceRecorderTimer = setInterval(() => {
        this.voiceRecorderSeconds += 1;
        this.cdr.markForCheck();
      }, 1e3);
    } catch {
      this.voiceRecorderError = "Microphone access was blocked.";
      this.resetVoiceRecorder({ keepOpen: true, keepError: true });
      this.cdr.markForCheck();
    }
  }
  stopVoiceRecording(event) {
    event?.stopPropagation();
    if (this.voiceRecorder?.state === "recording") {
      this.voiceRecorder.stop();
      return;
    }
    this.resetVoiceRecorder({ keepOpen: true });
  }
  discardVoiceRecording(event) {
    event?.stopPropagation();
    this.resetVoiceRecorder();
  }
  canSendVoiceClip() {
    return this.voiceRecordingState === "recorded" && !!this.voiceClipDataUrl && !this.chatInitialLoadPending;
  }
  async sendVoiceClip(event) {
    event?.stopPropagation();
    if (!this.canSendVoiceClip()) {
      return;
    }
    this.voiceRecordingState = "saving";
    this.voiceRecorderError = "";
    this.cdr.markForCheck();
    const voiceKey = `voice:${this.activeUserId() || "self"}:${Date.now()}`;
    const voiceUrl = await this.persistVoiceClipByConfiguredMode(voiceKey);
    if (!voiceUrl) {
      this.voiceRecordingState = "recorded";
      this.cdr.markForCheck();
      return;
    }
    this.sendLocalAttachmentMessage({
      id: voiceKey,
      type: "voice",
      title: "Voice clip",
      subtitle: this.formatVoiceDuration(this.voiceRecorderSeconds),
      url: voiceUrl,
      mimeType: this.voiceClipMimeType || null,
      sizeBytes: this.voiceClipSizeBytes || null
    }, "");
    this.resetVoiceRecorder();
  }
  voiceAttachmentAudioSrc(attachment) {
    const url = `${attachment.url ?? attachment.previewUrl ?? ""}`.trim();
    if (!this.chatVoiceClipsService.isVoiceClipUrl(url)) {
      return url;
    }
    const cached = this.voiceAttachmentSrcByKey[url];
    if (cached) {
      return cached;
    }
    if (!this.loadingVoiceClipKeys.has(url)) {
      this.loadingVoiceClipKeys.add(url);
      void this.chatVoiceClipsService.loadVoiceClipByUrl(url).then((clip) => {
        if (clip?.dataUrl) {
          this.voiceAttachmentSrcByKey[url] = clip.dataUrl;
        }
      }).finally(() => {
        this.loadingVoiceClipKeys.delete(url);
        this.cdr.markForCheck();
      });
    }
    return "";
  }
  pollState(attachment) {
    return this.parsePollState(attachment);
  }
  pollTotalVotes(poll) {
    return poll.options.reduce((total, option) => total + option.votes.length, 0);
  }
  pollOptionPercent(poll, option) {
    const memberTotal = Math.max(0, this.session()?.item.memberIds?.length ?? 0);
    const total = Math.max(memberTotal, this.pollTotalVotes(poll), 1);
    return total > 0 ? Math.round(option.votes.length / total * 100) : 0;
  }
  selectedPollOptionId(message, attachment) {
    const messageId = `${message.id ?? ""}`.trim();
    return messageId ? this.selectedPollOptionByMessageId[messageId] || this.pollOwnVoteOptionId(attachment) : "";
  }
  openPollVoteDialog(message, attachment, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    const attachmentId = `${attachment.id ?? ""}`.trim();
    if (!messageId || !attachmentId) {
      return;
    }
    this.pollVoteMessageId = messageId;
    this.pollVoteAttachmentId = attachmentId;
    this.selectedPollOptionByMessageId = __spreadProps(__spreadValues({}, this.selectedPollOptionByMessageId), {
      [messageId]: this.selectedPollOptionId(__spreadProps(__spreadValues({}, message), { id: messageId }), __spreadProps(__spreadValues({}, attachment), { id: attachmentId }))
    });
  }
  closePollVoteDialog() {
    this.pollVoteMessageId = "";
    this.pollVoteAttachmentId = "";
  }
  pollVoteDialogContext() {
    const message = this.messages.find((item) => item.id === this.pollVoteMessageId) ?? null;
    const attachment = message?.attachments?.find((item) => item.id === this.pollVoteAttachmentId && item.type === "poll") ?? null;
    return message && attachment ? {
      message,
      attachment,
      poll: this.parsePollState(attachment)
    } : null;
  }
  selectPollOption(message, _attachment, option, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    const optionId = `${option.id ?? ""}`.trim();
    if (!messageId || !optionId) {
      return;
    }
    this.selectedPollOptionByMessageId = __spreadProps(__spreadValues({}, this.selectedPollOptionByMessageId), {
      [messageId]: optionId
    });
  }
  canSubmitPollVote(message, attachment) {
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      return false;
    }
    const selectedOptionId = this.selectedPollOptionByMessageId[messageId] || "";
    return !!selectedOptionId && selectedOptionId !== this.pollOwnVoteOptionId(attachment);
  }
  pollVoteActionMenuItems(message, attachment) {
    return [
      {
        id: "poll-vote-cancel",
        label: "Cancel",
        layout: "action",
        palette: "slate",
        ariaLabel: "Cancel vote"
      },
      {
        id: "poll-vote-submit",
        label: "Submit",
        layout: "action",
        palette: "blue",
        disabled: !this.canSubmitPollVote(message, attachment),
        ariaLabel: "Submit vote"
      }
    ];
  }
  onPollVoteActionSelect(message, attachment, event) {
    if (event.id === "poll-vote-cancel") {
      this.closePollVoteDialog();
      return;
    }
    if (event.id === "poll-vote-submit") {
      this.submitPollVote(message, attachment, event.sourceEvent);
    }
  }
  submitPollVote(message, attachment, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      this.closePollVoteDialog();
      return;
    }
    const selectedOptionId = this.selectedPollOptionByMessageId[messageId] || "";
    if (!selectedOptionId) {
      return;
    }
    const activeUserId = this.activeUserId() || "self";
    const presentation = this.resolveOptimisticSenderPresentation(activeUserId);
    const currentMessage = this.messages.find((item) => item.id === messageId) ?? __spreadProps(__spreadValues({}, message), { id: messageId });
    const poll = this.parsePollState(attachment);
    const nextPoll = __spreadProps(__spreadValues({}, poll), {
      options: poll.options.map((option) => __spreadProps(__spreadValues({}, option), {
        votes: [
          ...option.votes.filter((vote) => vote.userId !== activeUserId),
          ...option.id === selectedOptionId ? [{
            userId: activeUserId,
            initials: presentation.senderAvatar.initials,
            gender: presentation.senderAvatar.gender
          }] : []
        ]
      }))
    });
    const nextAttachment = __spreadProps(__spreadValues({}, attachment), {
      title: nextPoll.question,
      description: this.serializePollState(nextPoll)
    });
    const nextAttachments = (currentMessage.attachments ?? []).map((item) => item.id === attachment.id ? nextAttachment : __spreadValues({}, item));
    const optimisticMessage = __spreadProps(__spreadValues({}, currentMessage), {
      attachments: nextAttachments,
      deliveryState: "pending"
    });
    this.replaceExistingChatMessage(optimisticMessage);
    this.schedulePendingMessageTimeout(messageId);
    this.closePollVoteDialog();
    this.cdr.markForCheck();
    const session = this.session();
    if (!session) {
      return;
    }
    const mutationSequence = (this.pollVoteMutationSequenceByMessageId.get(messageId) ?? 0) + 1;
    this.pollVoteMutationSequenceByMessageId.set(messageId, mutationSequence);
    void this.chatsService.updateChatMessage(session.item, messageId, { attachments: nextAttachments }).then((updated) => {
      if (this.pollVoteMutationSequenceByMessageId.get(messageId) !== mutationSequence) {
        return;
      }
      if (updated) {
        this.clearPendingMessageTimeout(messageId);
        this.clearPendingMessageState(messageId);
      }
      this.pollVoteMutationSequenceByMessageId.delete(messageId);
    }).catch(() => {
      if (this.pollVoteMutationSequenceByMessageId.get(messageId) === mutationSequence) {
        this.pollVoteMutationSequenceByMessageId.delete(messageId);
      }
    });
  }
  onImageAttachmentSelected(event) {
    const input = event.target;
    const file = input?.files?.[0] ?? null;
    if (input) {
      input.value = "";
    }
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    void this.sendLocalImageAttachment(file);
  }
  shareCurrentEvent(event) {
    event?.stopPropagation();
    this.memberMenuStore.requestActivitiesNavigation({ type: "eventExplore", stacked: true });
  }
  shareFirstAvailableAsset(event) {
    event?.stopPropagation();
    const state = this.selectedChatNavigationState;
    const resourceType = this.firstAvailableAssetType();
    if (state?.subEvent) {
      this.openSelectedChatSubEventResource(resourceType ?? ASSET_TYPE_TRANSPORT, event, true);
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "assetExplore",
      assetType: resourceType ?? ASSET_TYPE_TRANSPORT
    });
  }
  async shareCurrentWorkspaceWithSupport() {
    const session = this.session();
    const activeUserId = this.activeUserId();
    if (!session || !this.canShareWorkspaceWithSupport() || !activeUserId) {
      return;
    }
    const targetUrl = this.location.path(true) || "/";
    const token = await this.shareTokensService.createToken({
      kind: "adminHelp",
      entityId: targetUrl,
      ownerUserId: activeUserId
    });
    if (!token) {
      this.dialogStore.openInfo(this.i18n.translate("event.chat.support.token.unavailable"), {
        title: this.i18n.translate("app.support")
      });
      return;
    }
    this.sendLocalAttachmentMessage({
      id: `adminHelp:${activeUserId}:${Date.now()}`,
      type: "link",
      entityId: token,
      ownerUserId: activeUserId,
      title: this.i18n.translate("event.chat.support.shared.workspace"),
      subtitle: this.i18n.translate("event.chat.support.session.subtitle"),
      description: this.i18n.translate("event.chat.support.token.description"),
      url: this.location.prepareExternalUrl(`/admin/help/${encodeURIComponent(token)}`),
      previewUrl: null
    }, this.i18n.translate("event.chat.support.shared.message"));
  }
  chatAttachmentIcon(attachment) {
    switch (attachment.type) {
      case "event":
        return "event";
      case "asset":
        return "inventory_2";
      case "link":
        return "link";
      case "poll":
        return "poll";
      default:
        return "attachment";
    }
  }
  chatAttachmentTypeLabel(attachment) {
    switch (attachment.type) {
      case "event":
        return "Event";
      case "asset":
        return "Asset";
      case "link":
        return "Link";
      case "poll":
        return "Poll";
      default:
        return "Attachment";
    }
  }
  isAttachmentUnavailable(attachment) {
    return `${attachment.status ?? ""}`.trim().toLowerCase() === "unavailable";
  }
  unavailableAttachmentLabel(attachment) {
    const reason = `${attachment.unavailableReason ?? ""}`.trim().toLowerCase();
    const typeLabel = this.chatAttachmentTypeLabel(attachment).toLowerCase();
    switch (reason) {
      case "trashed":
        return `${this.capitalize(typeLabel)} deleted`;
      case "blocked":
      case "deleted":
      case "inactive":
        return `${this.capitalize(typeLabel)} unavailable`;
      default:
        return `${this.capitalize(typeLabel)} unavailable`;
    }
  }
  openChatAttachment(attachment, event) {
    event?.stopPropagation();
    if (this.isAttachmentUnavailable(attachment)) {
      this.dialogStore.openInfo(this.unavailableAttachmentLabel(attachment), {
        title: attachment.title || this.chatAttachmentTypeLabel(attachment)
      });
      return;
    }
    if (this.isInternalHelpUrl(`${attachment.url ?? ""}`)) {
      this.openExternalAttachmentUrl(attachment);
      return;
    }
    if (attachment.type === "event") {
      const attachmentEventId = `${attachment.entityId ?? ""}`.trim();
      const contextEventId = `${this.selectedChatNavigationState?.eventId ?? this.selectedChatOwnerParts().eventId}`.trim();
      if (!attachmentEventId || attachmentEventId === contextEventId) {
        this.openSelectedChatEvent();
        return;
      }
      void this.openSharedEventAttachment(attachment);
      return;
    }
    if (attachment.type === "asset") {
      this.openSharedAssetAttachment(attachment);
      return;
    }
    this.openExternalAttachmentUrl(attachment);
  }
  selectMessage(message, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      this.closeTransientMessageUi();
      return;
    }
    this.bindChatThreadScrollDismissListener();
    if (message.deletedAtIso) {
      this.closeTransientMessageUi();
      return;
    }
    this.selectedMessageId = this.selectedMessageId === messageId ? "" : messageId;
    this.selectedMessageToolsDown = this.selectedMessageId ? this.shouldOpenMessageToolsDown(event) : false;
    this.chatThreadSmartList?.closeMenu();
    this.quickReactionMessageId = "";
    this.quickReactionOpenDown = false;
  }
  startMessageLongPress(message) {
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId || message.deletedAtIso) {
      return;
    }
    this.clearMessageLongPress();
    this.messageLongPressTimer = setTimeout(() => {
      this.selectedMessageId = messageId;
      this.selectedMessageToolsDown = this.shouldOpenMessageToolsDown();
      this.quickReactionMessageId = "";
      this.quickReactionOpenDown = false;
      this.chatThreadSmartList?.closeMenu();
      this.cdr.markForCheck();
    }, 420);
  }
  clearMessageLongPress() {
    if (!this.messageLongPressTimer) {
      return;
    }
    clearTimeout(this.messageLongPressTimer);
    this.messageLongPressTimer = null;
  }
  toggleQuickReactions(message, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      this.closeTransientMessageUi();
      return;
    }
    this.bindChatThreadScrollDismissListener();
    const wasOpen = this.quickReactionMessageId === messageId;
    this.selectedMessageId = messageId;
    this.chatThreadSmartList?.closeMenu();
    this.quickReactionOpenDown = this.shouldOpenQuickReactionsDown(event);
    this.quickReactionMessageId = wasOpen ? "" : messageId;
    if (wasOpen) {
      this.blurEventTarget(event);
    }
  }
  emojiPickerMenuTrigger() {
    return {
      id: "emoji-picker",
      icon: "add",
      closeIcon: "close",
      ariaLabel: "Search emoji",
      layout: "icon",
      hideLabel: true,
      palette: "blue"
    };
  }
  emojiPickerMenuModel() {
    return {
      layout: "tabs",
      density: "compact",
      groups: this.emojiPickerCategories.map((category) => ({
        id: category.key,
        label: category.label,
        icon: category.icon,
        palette: this.emojiPickerCategoryPalette(category.key),
        items: category.emojis.map((emoji) => ({
          id: `emoji:${emoji}`,
          label: emoji,
          detail: category.label,
          icon: emoji,
          iconKind: "text",
          layout: "icon",
          ariaLabel: `React with ${emoji}`,
          value: emoji,
          closeOnSelect: true,
          context: {
            menu: "emoji-reaction",
            emoji
          }
        }))
      }))
    };
  }
  emojiPickerCategoryPalette(categoryKey) {
    switch (categoryKey) {
      case "smileys":
        return "amber";
      case "animals":
        return "green";
      case "food":
        return "orange";
      case "activity":
        return "violet";
      case "travel":
        return "sky";
      case "objects":
        return "slate";
      case "symbols":
        return "purple";
      case "flags":
        return "red";
      default:
        return "blue";
    }
  }
  onEmojiPickerMenuSelect(message, event) {
    const emoji = `${event.context?.emoji ?? event.value ?? ""}`.trim();
    if (!emoji) {
      return;
    }
    this.toggleReaction(message, emoji, event.sourceEvent);
  }
  toggleReaction(message, emoji, event) {
    event?.stopPropagation();
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      this.closeTransientMessageUi();
      return;
    }
    const activeUserId = this.activeUserId() || "self";
    const presentation = this.resolveOptimisticSenderPresentation(activeUserId);
    const currentMessage = this.messages.find((item) => item.id === messageId) ?? __spreadProps(__spreadValues({}, message), { id: messageId });
    const withoutMine = (currentMessage.reactions ?? []).filter((reaction) => !this.isOwnReaction(reaction, activeUserId, presentation));
    const sameReaction = (currentMessage.reactions ?? []).some((reaction) => this.isOwnReaction(reaction, activeUserId, presentation) && reaction.emoji === emoji);
    const reactionEmoji = sameReaction ? null : emoji;
    const optimisticMessage = __spreadProps(__spreadValues({}, currentMessage), {
      deliveryState: "pending",
      reactions: reactionEmoji ? [
        ...withoutMine,
        {
          emoji: reactionEmoji,
          userId: activeUserId,
          userName: presentation.sender,
          userInitials: presentation.senderAvatar.initials,
          userGender: presentation.senderAvatar.gender,
          reactedAtIso: (/* @__PURE__ */ new Date()).toISOString()
        }
      ] : withoutMine
    });
    const queueUntilStored = this.isPendingOutgoingChatMessage(currentMessage);
    this.replaceExistingChatMessage(optimisticMessage);
    this.closeTransientMessageUi();
    this.cdr.markForCheck();
    if (queueUntilStored) {
      this.queuedReactionByPendingMessageId.set(messageId, reactionEmoji);
      return;
    }
    this.schedulePendingMessageTimeout(messageId);
    const session = this.session();
    if (session) {
      const mutationSequence = (this.reactionMutationSequenceByMessageId.get(messageId) ?? 0) + 1;
      this.reactionMutationSequenceByMessageId.set(messageId, mutationSequence);
      void this.chatsService.updateChatMessage(session.item, messageId, { reactionEmoji }).then((updated) => {
        if (this.reactionMutationSequenceByMessageId.get(messageId) !== mutationSequence) {
          return;
        }
        if (updated) {
          this.clearPendingMessageTimeout(messageId);
          this.clearPendingMessageState(messageId);
        }
        this.reactionMutationSequenceByMessageId.delete(messageId);
      }).catch(() => {
        if (this.reactionMutationSequenceByMessageId.get(messageId) === mutationSequence) {
          this.reactionMutationSequenceByMessageId.delete(messageId);
        }
      });
    }
  }
  reactionSummary(message) {
    const counts = /* @__PURE__ */ new Map();
    for (const reaction of message.reactions ?? []) {
      counts.set(reaction.emoji, (counts.get(reaction.emoji) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([emoji, count]) => ({ emoji, count }));
  }
  isOwnReaction(reaction, activeUserId, presentation) {
    const reactionUserId = `${reaction.userId ?? ""}`.trim();
    const knownOwnIds = new Set([
      `${activeUserId ?? ""}`.trim(),
      `${presentation.senderAvatar.id ?? ""}`.trim(),
      `${this.userProfileStore.activeUserProfile()?.id ?? ""}`.trim(),
      "self",
      "me"
    ].filter(Boolean));
    if (knownOwnIds.has(reactionUserId)) {
      return true;
    }
    const reactionName = `${reaction.userName ?? ""}`.trim().toLowerCase();
    return reactionName === "you";
  }
  openReactionDetails(message, event) {
    event?.stopPropagation();
    if ((message.reactions?.length ?? 0) === 0) {
      this.reactionDetailsMessageId = "";
      return;
    }
    this.reactionDetailsMessageId = `${message.id ?? ""}`.trim();
    this.reactionDetailsFilter = "all";
  }
  closeReactionDetails() {
    this.reactionDetailsMessageId = "";
  }
  reactionDetailsMessage() {
    const messageId = `${this.reactionDetailsMessageId ?? ""}`.trim();
    if (!messageId) {
      return null;
    }
    const message = this.messages.find((item) => item.id === messageId) ?? null;
    return message && (message.reactions?.length ?? 0) > 0 ? message : null;
  }
  reactionDetailsRows(message) {
    return this.reactionDetailsFilter === "all" ? message.reactions ?? [] : (message.reactions ?? []).filter((reaction) => reaction.emoji === this.reactionDetailsFilter);
  }
  setReplyTarget(message, event) {
    event?.stopPropagation();
    if (message.deletedAtIso) {
      return;
    }
    this.replyTarget = {
      id: message.id,
      sender: message.mine ? "yourself" : message.sender,
      text: this.replyReferenceText(message)
    };
    this.closeTransientMessageUi();
    this.focusComposerSoon();
  }
  replyPreviewText(replyTo) {
    const preview = this.replyPreviewParts(replyTo);
    return preview.meta ? `${preview.title} \xB7 ${preview.meta}` : preview.title;
  }
  replyPreviewParts(replyTo) {
    const sourceMessage = this.messages.find((message) => message.id === `${replyTo?.id ?? ""}`.trim());
    const sourceAttachment = sourceMessage?.attachments?.[0];
    if (sourceAttachment?.type === "event") {
      return this.attachmentReferenceParts(sourceAttachment, "Event");
    }
    if (sourceAttachment?.type === "asset") {
      return this.attachmentReferenceParts(sourceAttachment, "Asset");
    }
    if (sourceAttachment?.type === "image") {
      return { title: "Image", meta: "" };
    }
    const text = `${replyTo?.text ?? ""}`.trim();
    return { title: text === "Sent an image" ? "Image" : text || "Message", meta: "" };
  }
  jumpToReplySource(message, event) {
    event?.stopPropagation();
    const targetId = `${message.replyTo?.id ?? ""}`.trim();
    if (!targetId) {
      return;
    }
    if (!this.ensureChatThreadMessageVisible(targetId)) {
      return;
    }
    this.selectedMessageId = "";
    this.highlightedMessageId = targetId;
    this.chatThreadSmartList?.closeMenu();
    this.quickReactionMessageId = "";
    this.cdr.markForCheck();
    this.scheduleChatThreadScrollToMessage(targetId);
    setTimeout(() => {
      if (this.highlightedMessageId === targetId) {
        this.highlightedMessageId = "";
        this.cdr.markForCheck();
      }
    }, 1200);
  }
  clearReplyTarget() {
    this.replyTarget = null;
  }
  beginEditMessage(message, event) {
    event?.stopPropagation();
    if (!message.mine || message.deletedAtIso) {
      return;
    }
    this.editingMessageId = message.id;
    this.draftMessage = message.text;
    this.closeTransientMessageUi({ keepEditing: true });
    this.focusComposerSoon();
    this.resizeComposerTextareaSoon();
  }
  cancelEditing() {
    this.editingMessageId = "";
    this.draftMessage = "";
    this.resizeComposerTextareaSoon();
  }
  unsendMessage(message, event) {
    event?.stopPropagation();
    if (!message.mine) {
      return;
    }
    this.replaceExistingChatMessage(__spreadProps(__spreadValues({}, message), {
      text: "",
      deliveryState: "pending",
      deletedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      deletedByUserId: this.activeUserId() || "self",
      deletedByName: "You",
      reactions: [],
      readBy: []
    }));
    this.schedulePendingMessageTimeout(message.id);
    this.closeTransientMessageUi();
    this.cdr.markForCheck();
    const session = this.session();
    if (session) {
      void this.chatsService.updateChatMessage(session.item, message.id, { deleted: true }).then((updated) => {
        if (updated) {
          this.clearPendingMessageTimeout(message.id);
          this.clearPendingMessageState(message.id);
        }
      }).catch(() => {
        return;
      });
    }
  }
  deletedMessageLabel(message) {
    if (message.deliveryState === "pending") {
      return "Deleting message";
    }
    return message.mine || message.deletedByName === "You" ? "You deleted this message" : `${message.deletedByName || message.sender} deleted this message`;
  }
  togglePinMessage(message, event) {
    event?.stopPropagation();
    const activeUserId = this.activeUserId() || "self";
    const pinned = !message.pinnedAtIso;
    this.replaceExistingChatMessage(__spreadProps(__spreadValues({}, message), {
      deliveryState: "pending",
      pinnedAtIso: pinned ? (/* @__PURE__ */ new Date()).toISOString() : null,
      pinnedByUserId: pinned ? activeUserId : null
    }));
    this.schedulePendingMessageTimeout(message.id);
    this.closeTransientMessageUi();
    this.cdr.markForCheck();
    const session = this.session();
    if (session) {
      void this.chatsService.updateChatMessage(session.item, message.id, { pinned }).then((updated) => {
        if (updated) {
          this.clearPendingMessageTimeout(message.id);
          this.clearPendingMessageState(message.id);
        }
      }).catch(() => {
        return;
      });
    }
  }
  pinnedMessages() {
    return this.messages.filter((message) => !!message.pinnedAtIso).sort((first, second) => AppUtils.toSortableDate(second.pinnedAtIso ?? "") - AppUtils.toSortableDate(first.pinnedAtIso ?? ""));
  }
  openPinnedMessagesDialog(event) {
    event?.stopPropagation();
    this.pinnedDialogOpen = true;
  }
  closePinnedMessagesDialog() {
    this.pinnedDialogOpen = false;
  }
  selectPinnedMessage(message) {
    this.selectedMessageId = message.id;
    this.selectedMessageToolsDown = false;
    this.highlightedMessageId = message.id;
    this.closePinnedMessagesDialog();
    this.scheduleChatThreadScrollToMessage(message.id);
    setTimeout(() => {
      if (this.highlightedMessageId === message.id) {
        this.highlightedMessageId = "";
        this.cdr.markForCheck();
      }
    }, 1200);
  }
  reportMessage(message, event) {
    event?.stopPropagation();
    this.chatThreadSmartList?.closeMenu();
    if (!this.canReportMessage(message)) {
      return;
    }
    const session = this.session();
    const target = this.resolveChatReportTarget(message);
    const eventId = `${this.chatOwnerParts(session?.item ?? null).eventId}`.trim();
    if (!target || !eventId) {
      return;
    }
    const attachment = this.resolveViewableMessageAttachment(message);
    this.profileStore.openReportUserPopup({
      targetUserId: target.userId,
      targetName: target.name,
      eventId,
      eventTitle: session?.item.title ?? null,
      eventTimeframe: session?.item.dateIso ?? null,
      ownerType: "event",
      sourceType: "chat",
      sourceId: message.id,
      sourceText: message.text?.trim() || this.chatAttachmentSummary(message),
      chatId: session?.item.id ?? null,
      messageId: message.id,
      assetId: attachment?.type === "asset" ? attachment.entityId ?? attachment.id : null,
      assetType: attachment?.type === "asset" ? attachment.assetType ?? null : null
    });
  }
  canReportMessage(message) {
    if (this.isAdminRoleActive() || message.mine) {
      return false;
    }
    return this.resolveChatReportTarget(message) !== null;
  }
  isAdminRoleActive() {
    const hostTier = `${this.userProfileStore.activeUserProfile()?.hostTier ?? ""}`.trim().toLowerCase();
    if (hostTier === "admin") {
      return true;
    }
    const activeUserId = this.activeUserId();
    return activeUserId === "admin" || activeUserId.startsWith("admin-");
  }
  resolveChatReportTarget(message) {
    if (message.mine) {
      return null;
    }
    const activeUserId = this.activeUserId();
    const messageSenderId = `${message.senderAvatar?.id ?? ""}`.trim();
    if (messageSenderId && messageSenderId !== activeUserId) {
      return {
        userId: messageSenderId,
        name: `${message.sender ?? ""}`.trim() || "Chat member"
      };
    }
    return null;
  }
  messageHasViewableAttachment(message) {
    return this.resolveViewableMessageAttachment(message) !== null;
  }
  viewSharedMessage(message, event) {
    event?.stopPropagation();
    const attachment = this.resolveViewableMessageAttachment(message);
    if (!attachment) {
      return;
    }
    this.closeTransientMessageUi();
    this.openChatAttachment(attachment, event);
  }
  chatTextSegments(text) {
    const value = `${text ?? ""}`;
    const urlPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
    const segments = [];
    let lastIndex = 0;
    let match;
    while ((match = urlPattern.exec(value)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          id: `text:${lastIndex}`,
          text: value.slice(lastIndex, match.index)
        });
      }
      const rawUrl = match[0].replace(/[),.;!?]+$/g, "");
      const trailing = match[0].slice(rawUrl.length);
      segments.push({
        id: `link:${match.index}`,
        text: rawUrl,
        url: rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`
      });
      if (trailing) {
        segments.push({
          id: `text:${match.index + rawUrl.length}`,
          text: trailing
        });
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < value.length) {
      segments.push({
        id: `text:${lastIndex}`,
        text: value.slice(lastIndex)
      });
    }
    return segments.length > 0 ? segments : [{ id: "text:0", text: value }];
  }
  openChatTextLink(url, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const safeUrl = `${url ?? ""}`.trim();
    if (!safeUrl) {
      return;
    }
    this.confirmExternalLink(safeUrl);
  }
  async sendMessage() {
    const text = AppUtils.convertAsciiEmojis(this.draftMessage.trim());
    const session = this.session();
    if (!session || !text) {
      return;
    }
    if (this.editingMessageId) {
      this.commitEditMessage(text);
      return;
    }
    const sharedAttachment = await this.resolveShareAttachmentFromText(text);
    if (sharedAttachment) {
      this.sendLocalAttachmentMessage(sharedAttachment, "");
      return;
    }
    const sessionKey = `${session.item.id}:${session.openedAtIso}`;
    const optimisticMessage = this.buildOptimisticChatMessage(text);
    this.draftMessage = "";
    this.replyTarget = null;
    this.resizeComposerTextareaSoon();
    this.stopLocalTyping();
    this.mergeIncomingChatMessage(optimisticMessage);
    this.schedulePendingMessageTimeout(optimisticMessage.id);
    this.cdr.markForCheck();
    void this.chatsService.sendChatMessageWithAttachments(session.item, text, [], optimisticMessage.clientId, optimisticMessage.replyTo).then((message) => {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      if (message) {
        this.confirmPendingChatMessage(optimisticMessage.id, message);
      }
    }).catch(() => {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      this.cdr.markForCheck();
    });
  }
  async sendLocalImageAttachment(file) {
    const session = this.session();
    if (!session || this.chatInitialLoadPending) {
      return;
    }
    const previewUrl = await this.readFileAsDataUrl(file);
    const sentAt = /* @__PURE__ */ new Date();
    const activeUserId = this.activeUserId();
    const senderPresentation = this.resolveOptimisticSenderPresentation(activeUserId);
    const clientId = `pending:image:${activeUserId || "self"}:${sentAt.getTime()}:${++this.optimisticMessageSequence}`;
    const attachmentId = `${clientId}:image`;
    const imageAttachment = {
      id: attachmentId,
      type: "image",
      title: file.name || "Image",
      previewUrl,
      mimeType: file.type || null,
      sizeBytes: file.size
    };
    const imageMessage = {
      id: clientId,
      clientId,
      sender: senderPresentation.sender,
      senderAvatar: senderPresentation.senderAvatar,
      text: AppUtils.convertAsciiEmojis(this.draftMessage.trim()),
      time: sentAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sentAtIso: sentAt.toISOString(),
      mine: true,
      readBy: [],
      deliveryState: "pending",
      replyTo: this.replyTarget ? __spreadValues({}, this.replyTarget) : null,
      attachments: [__spreadValues({}, imageAttachment)]
    };
    const caption = AppUtils.convertAsciiEmojis(this.draftMessage.trim());
    const sessionKey = `${session.item.id}:${session.openedAtIso}`;
    this.draftMessage = "";
    this.replyTarget = null;
    this.resizeComposerTextareaSoon();
    this.stopLocalTyping();
    this.mergeIncomingChatMessage(imageMessage);
    this.schedulePendingMessageTimeout(imageMessage.id);
    this.cdr.markForCheck();
    try {
      const persistedAttachment = await this.resolvePersistableImageAttachment(session.item, imageAttachment, file);
      const persistedMessage = await this.chatsService.sendChatMessageWithAttachments(session.item, caption, [persistedAttachment], imageMessage.clientId, imageMessage.replyTo);
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      if (persistedMessage) {
        this.confirmPendingChatMessage(imageMessage.id, persistedMessage);
        return;
      }
      this.cdr.markForCheck();
    } catch {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      this.markPendingMessageTimedOut(imageMessage.id);
      this.cdr.markForCheck();
    }
  }
  sendLocalAttachmentMessage(attachment, captionOverride) {
    const session = this.session();
    if (!session || this.chatInitialLoadPending) {
      return;
    }
    const caption = AppUtils.convertAsciiEmojis(captionOverride ?? this.draftMessage.trim());
    const optimisticMessage = __spreadProps(__spreadValues({}, this.buildOptimisticChatMessage(caption)), {
      attachments: [__spreadValues({}, attachment)]
    });
    const sessionKey = `${session.item.id}:${session.openedAtIso}`;
    this.draftMessage = "";
    this.replyTarget = null;
    this.resizeComposerTextareaSoon();
    this.stopLocalTyping();
    this.mergeIncomingChatMessage(optimisticMessage);
    this.schedulePendingMessageTimeout(optimisticMessage.id);
    this.cdr.markForCheck();
    void this.chatsService.sendChatMessageWithAttachments(session.item, caption, [__spreadValues({}, attachment)], optimisticMessage.clientId, optimisticMessage.replyTo).then((message) => {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      if (message) {
        this.confirmPendingChatMessage(optimisticMessage.id, message);
        return;
      }
      this.cdr.markForCheck();
    }).catch(() => {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      this.cdr.markForCheck();
    });
  }
  async resolveShareAttachmentFromText(text) {
    const token = this.parseShareToken(text);
    if (!token) {
      return null;
    }
    const resolved = await this.shareTokensService.resolveToken(token, this.activeUserId());
    if (!resolved) {
      this.dialogStore.openInfo("This share token is expired or no longer available.", {
        title: "Share link"
      });
      return null;
    }
    if (resolved.kind === "adminHelp") {
      return {
        id: `adminHelp:${resolved.ownerUserId ?? "user"}:${Date.now()}`,
        type: "link",
        entityId: token,
        ownerUserId: resolved.ownerUserId ?? null,
        title: resolved.title || "Open shared help view",
        subtitle: resolved.subtitle ?? null,
        description: null,
        url: this.location.prepareExternalUrl(`/admin/help/${encodeURIComponent(token)}`),
        previewUrl: resolved.imageUrl ?? null
      };
    }
    return {
      id: `${resolved.kind}:${resolved.entityId}:${Date.now()}`,
      type: resolved.kind,
      entityId: resolved.entityId,
      assetType: resolved.kind === "asset" ? resolved.assetType ?? null : null,
      ownerUserId: resolved.kind === "asset" ? resolved.ownerUserId ?? null : null,
      title: resolved.title,
      subtitle: resolved.subtitle ?? null,
      description: resolved.description ?? null,
      url: resolved.url ?? null,
      previewUrl: resolved.imageUrl ?? null
    };
  }
  parseShareToken(text) {
    const normalized = `${text ?? ""}`.trim();
    return normalized.match(/^myscoutee:token:[A-Za-z0-9-]+$/) ? normalized : null;
  }
  findSharedAssetResourceType(attachment) {
    const assetId = `${attachment.entityId ?? ""}`.trim();
    const state = this.selectedChatNavigationState;
    if (!assetId || !state?.subEvent) {
      return null;
    }
    return ASSET_TYPES.find((type) => state.assetCardsByType[type]?.some((card) => {
      const sourceAssetId = "sourceAssetId" in card ? `${card.sourceAssetId ?? ""}`.trim() : "";
      return card.id === assetId || sourceAssetId === assetId;
    })) ?? null;
  }
  openSharedAssetAttachment(attachment) {
    const resourceType = this.findSharedAssetResourceType(attachment);
    if (resourceType) {
      this.openSelectedChatSubEventResource(resourceType, void 0, false, `${attachment.entityId ?? ""}`.trim() || void 0);
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "assetExplore",
      assetType: this.normalizeAttachmentAssetType(attachment.assetType) ?? ASSET_TYPE_TRANSPORT,
      assetId: `${attachment.entityId ?? ""}`.trim() || void 0,
      viewOnly: true,
      fallbackAsset: this.assetAttachmentToViewCard(attachment)
    });
  }
  assetAttachmentToViewCard(attachment) {
    const assetId = `${attachment.entityId ?? ""}`.trim();
    const assetType = this.normalizeAttachmentAssetType(attachment.assetType) ?? ASSET_TYPE_TRANSPORT;
    if (!assetId) {
      return void 0;
    }
    const subtitle = `${attachment.subtitle ?? ""}`.trim();
    const subtitleParts = subtitle.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
    return {
      id: assetId,
      type: assetType,
      title: `${attachment.title ?? ""}`.trim() || "Shared asset",
      subtitle: subtitleParts.length > 1 ? subtitleParts.slice(1).join(" - ") : subtitle,
      category: void 0,
      city: subtitleParts.length > 1 ? subtitleParts[subtitleParts.length - 1] : "",
      capacityTotal: 1,
      quantity: 1,
      description: `${attachment.description ?? ""}`.trim(),
      imageUrl: `${attachment.previewUrl ?? ""}`.trim(),
      visibility: "Public",
      ownerUserId: `${attachment.ownerUserId ?? ""}`.trim() || void 0,
      requests: []
    };
  }
  normalizeAttachmentAssetType(value) {
    return isAssetType(value) ? value : null;
  }
  openExternalAttachmentUrl(attachment) {
    const url = `${attachment.url ?? ""}`.trim();
    if (!url) {
      this.dialogStore.openInfo("This shared item is not available from the current chat context.", {
        title: attachment.title || "Shared item"
      });
      return;
    }
    if (this.isInternalHelpUrl(url)) {
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return;
    }
    this.confirmExternalLink(url);
  }
  isInternalHelpUrl(url) {
    const normalized = `${url ?? ""}`.trim();
    if (normalized.startsWith("/admin/help/")) {
      return true;
    }
    if (typeof document === "undefined") {
      return false;
    }
    try {
      const parsed = new URL(normalized, document.baseURI);
      const basePath = new URL(document.baseURI).pathname.replace(/\/$/, "");
      const baseHelpPath = `${basePath}/admin/help/`.replace(/\/{2,}/g, "/");
      return parsed.origin === window.location.origin && (parsed.pathname.startsWith("/admin/help/") || parsed.pathname.startsWith(baseHelpPath));
    } catch {
      return false;
    }
  }
  confirmExternalLink(url) {
    this.dialogStore.open({
      title: this.i18n.translate("event.chat.external.link.title"),
      message: this.i18n.translateParams("event.chat.external.link.message", {
        productName: this.deploymentConfiguration.branding().productName
      }),
      confirmLabel: this.i18n.translate("continue"),
      cancelLabel: this.i18n.translate("cancel"),
      confirmTone: "accent",
      onConfirm: () => {
        if (typeof window !== "undefined") {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    });
  }
  async openSharedEventAttachment(attachment) {
    const eventId = `${attachment.entityId ?? ""}`.trim();
    if (!eventId) {
      this.dialogStore.openInfo("This event is not available anymore.", {
        title: attachment.title || "Shared event"
      });
      return;
    }
    const eventRecord = await this.eventsService.queryKnownRecordById(this.activeUserId(), eventId);
    if (!eventRecord) {
      this.dialogStore.openInfo("This event is not available anymore.", {
        title: attachment.title || "Shared event"
      });
      return;
    }
    this.memberMenuStore.requestActivitiesNavigation({
      type: "eventEditor",
      eventId: eventRecord.id,
      target: this.eventEditorTargetForRecord(eventRecord),
      readOnly: true
    });
  }
  resolveViewableMessageAttachment(message) {
    if (message.deletedAtIso) {
      return null;
    }
    return (message.attachments ?? []).find((attachment) => (attachment.type === "event" || attachment.type === "asset" || attachment.type === "link") && !this.isAttachmentUnavailable(attachment)) ?? null;
  }
  async resolvePersistableImageAttachment(chat, attachment, file) {
    const upload = await this.mediaService.uploadImage(this.activeUserId() || "chat", `${chat.id || "chat"}-${Date.now()}`, file);
    if (!upload.uploaded || !upload.imageUrl) {
      throw new Error("Unable to upload chat image.");
    }
    const mediaUrl = upload.imageSet?.largeUrl ?? upload.imageUrl;
    const previewUrl = upload.imageSet?.mediumUrl ?? upload.imageUrl;
    return __spreadProps(__spreadValues({}, attachment), {
      url: mediaUrl,
      previewUrl
    });
  }
  async persistVoiceClipByConfiguredMode(voiceKey) {
    const mimeType = this.voiceClipMimeType || "audio/webm";
    const session = this.session();
    const ownerId = `${session?.item.id ?? this.activeUserId() ?? "chat"}`.trim();
    const extension = mimeType.includes("mp4") || mimeType.includes("aac") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";
    const file = this.dataUrlToFile(this.voiceClipDataUrl, `${voiceKey.replace(/[^a-zA-Z0-9._-]+/g, "-")}.${extension}`, mimeType);
    const upload = await this.mediaService.uploadAudio(ownerId || "chat", voiceKey, file, {
      dataUrl: this.voiceClipDataUrl,
      durationSeconds: this.voiceRecorderSeconds,
      sizeBytes: this.voiceClipSizeBytes
    });
    if (upload.uploaded && upload.audioUrl) {
      if (this.chatVoiceClipsService.isVoiceClipUrl(upload.audioUrl)) {
        this.voiceAttachmentSrcByKey[upload.audioUrl] = this.voiceClipDataUrl;
      }
      return upload.audioUrl;
    }
    this.voiceRecorderError = "Voice upload failed.";
    return null;
  }
  parsePollState(attachment) {
    const fallbackOptions = `${attachment.subtitle ?? ""}`.split("\n").map((option) => option.trim()).filter(Boolean);
    try {
      const parsed = JSON.parse(`${attachment.description ?? ""}`);
      const question = `${parsed?.question ?? attachment.title ?? ""}`.trim();
      const options = Array.isArray(parsed?.options) ? parsed.options.map((option, index) => {
        const value = option;
        const text = `${value.text ?? ""}`.trim();
        if (!text) {
          return null;
        }
        return {
          id: `${value.id ?? `${attachment.id}:option:${index + 1}`}`,
          text,
          votes: Array.isArray(value.votes) ? value.votes.map((vote) => {
            const voteValue = vote;
            const userId = `${voteValue.userId ?? ""}`.trim();
            if (!userId) {
              return null;
            }
            return {
              userId,
              name: `${voteValue.name ?? ""}`.trim() || void 0,
              initials: `${voteValue.initials ?? "ME"}`.trim() || "ME",
              gender: this.normalizeChatUserGender(voteValue.gender)
            };
          }).filter((vote) => vote !== null) : []
        };
      }).filter((option) => option !== null) : [];
      if (question && options.length > 0) {
        return { question, options };
      }
    } catch {
    }
    return {
      question: `${attachment.title ?? "Poll"}`.trim() || "Poll",
      options: fallbackOptions.map((option, index) => ({
        id: `${attachment.id}:option:${index + 1}`,
        text: option,
        votes: []
      }))
    };
  }
  serializePollState(poll) {
    return JSON.stringify({
      question: poll.question,
      options: poll.options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes.map((vote) => ({
          userId: vote.userId,
          name: vote.name,
          initials: vote.initials,
          gender: vote.gender
        }))
      }))
    });
  }
  normalizeChatUserGender(value) {
    const normalized = `${value ?? ""}`.trim().toLowerCase();
    if (normalized === "deleted" || normalized === "du") {
      return "deleted";
    }
    return normalized === "woman" || normalized.startsWith("w") || normalized.startsWith("f") ? "woman" : "man";
  }
  pollOwnVoteOptionId(attachment) {
    const activeUserId = this.activeUserId() || "self";
    const poll = this.parsePollState(attachment);
    return poll.options.find((option) => option.votes.some((vote) => vote.userId === activeUserId))?.id ?? "";
  }
  dataUrlToFile(dataUrl, filename, mimeType) {
    const [meta, encoded] = dataUrl.split(",", 2);
    const resolvedMimeType = (meta.match(/^data:([^;]+);base64$/)?.[1] ?? mimeType).trim();
    const binary = atob(encoded ?? "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], filename, { type: resolvedMimeType });
  }
  readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(`${reader.result ?? ""}`);
      reader.onerror = () => reject(reader.error ?? new Error("Unable to read image."));
      reader.readAsDataURL(file);
    });
  }
  commitEditMessage(text) {
    const convertedText = AppUtils.convertAsciiEmojis(text.trim());
    const editingMessageId = this.editingMessageId;
    if (!editingMessageId || !convertedText) {
      return;
    }
    const session = this.session();
    this.messages = this.messages.map((message) => message.id === editingMessageId ? __spreadProps(__spreadValues({}, message), {
      text: convertedText,
      editedAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      deliveryState: "pending"
    }) : message);
    this.draftMessage = "";
    this.editingMessageId = "";
    this.resizeComposerTextareaSoon();
    this.refreshVisibleChatThreadSurface();
    this.cdr.markForCheck();
    this.schedulePendingMessageTimeout(editingMessageId);
    if (session) {
      void this.chatsService.updateChatMessage(session.item, editingMessageId, { text: convertedText }).then((updated) => {
        if (updated) {
          this.clearPendingMessageTimeout(editingMessageId);
          this.clearPendingMessageState(editingMessageId);
        }
      }).catch(() => {
        return;
      });
    }
  }
  async loadChatThreadPage(query, sessionKey) {
    if (query.page === 0 && this.initialChatLoadedSessionKey !== sessionKey) {
      return this.loadInitialChatThreadPage(query, sessionKey);
    }
    const session = this.session();
    if (!session || this.loadedSessionKey !== sessionKey) {
      return this.emptyChatThreadPage();
    }
    try {
      const messagesPage = await this.chatsService.loadChatMessagesResult(session.item, query);
      if (this.loadedSessionKey !== sessionKey) {
        return this.emptyChatThreadPage();
      }
      const result = this.applyChatThreadMessagesPage(messagesPage);
      this.rebuildVisibleReadReceipts();
      this.applyLoadedChatReadReceipt(session.item, messagesPage);
      return result;
    } catch {
      return this.emptyChatThreadPage();
    }
  }
  async loadInitialChatThreadPage(query, sessionKey) {
    const session = this.session();
    if (!session || this.loadedSessionKey !== sessionKey) {
      return this.emptyChatThreadPage();
    }
    this.chatInitialLoadPending = true;
    this.cdr.markForCheck();
    try {
      const chat = session.item;
      const messagesPage = await this.chatsService.loadChatMessagesResult(chat, query);
      if (this.loadedSessionKey !== sessionKey) {
        return this.emptyChatThreadPage();
      }
      const result = this.applyChatThreadMessagesPage(messagesPage, { replace: true });
      this.rebuildVisibleReadReceipts();
      this.syncEventChatSummaryFromLatestMessage();
      this.initialChatLoadedSessionKey = sessionKey;
      this.applyLoadedChatReadReceipt(chat, messagesPage);
      await this.startLiveChatUpdates(chat, sessionKey);
      return result;
    } catch {
      if (this.loadedSessionKey !== sessionKey) {
        return this.emptyChatThreadPage();
      }
      this.messages = [];
      this.rebuildVisibleReadReceipts();
      this.initialChatLoadedSessionKey = sessionKey;
      await this.startLiveChatUpdates(session.item, sessionKey);
      return this.emptyChatThreadPage();
    } finally {
      if (this.loadedSessionKey === sessionKey) {
        this.chatInitialLoadPending = false;
        this.cdr.markForCheck();
      }
    }
  }
  applyChatThreadMessagesPage(page, options = {}) {
    const items = this.normalizeChatMessages(page.items).sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
    this.messages = this.deduplicateChatMessages(options.replace === true ? items : [...this.messages, ...items]).sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
    this.visibleChatThreadTotal = this.messages.length;
    const pageTotal = Math.trunc(Number(page.total) || 0);
    this.chatThreadKnownTotal = options.replace === true ? Math.max(this.messages.length, pageTotal) : Math.max(this.chatThreadKnownTotal, this.messages.length, pageTotal);
    return {
      items,
      total: this.chatThreadKnownTotal,
      nextCursor: page.nextCursor ?? null,
      context: this.chatHeaderContext ?? void 0
    };
  }
  emptyChatThreadPage() {
    return {
      items: [],
      total: this.chatThreadVisibleTotal(),
      nextCursor: null,
      context: this.chatHeaderContext ?? void 0
    };
  }
  chatThreadVisibleTotal() {
    return Math.max(this.chatThreadKnownTotal, this.messages.length);
  }
  syncChatThreadQuery() {
    if (!this.loadedSessionKey) {
      this.chatThreadQuery = {};
      return;
    }
    this.chatThreadQuery = {
      filters: {
        revision: this.chatThreadRevision,
        sessionKey: this.loadedSessionKey
      }
    };
  }
  async startLiveChatUpdates(chat, sessionKey) {
    if (this.loadedSessionKey !== sessionKey || this.liveChatUnsubscribe) {
      return;
    }
    this.liveChatUnsubscribe = await this.chatsService.watchChatEvents(chat, (event) => {
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      this.handleLiveChatEvent(chat, event);
    });
  }
  teardownLiveChatUpdates() {
    this.liveChatUnsubscribe?.();
    this.liveChatUnsubscribe = null;
    this.clearRemoteTypingIndicators();
  }
  buildOptimisticChatMessage(text) {
    const sentAt = /* @__PURE__ */ new Date();
    const activeUserId = this.activeUserId();
    const senderPresentation = this.resolveOptimisticSenderPresentation(activeUserId);
    const clientId = `pending:${activeUserId || "self"}:${sentAt.getTime()}:${++this.optimisticMessageSequence}`;
    return {
      id: clientId,
      clientId,
      sender: senderPresentation.sender,
      senderAvatar: senderPresentation.senderAvatar,
      text,
      time: sentAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sentAtIso: sentAt.toISOString(),
      mine: true,
      readBy: [],
      deliveryState: "pending",
      replyTo: this.replyTarget ? __spreadValues({}, this.replyTarget) : null
    };
  }
  isPendingOutgoingChatMessage(message) {
    const messageId = `${message.id ?? ""}`.trim();
    const clientId = `${message.clientId ?? ""}`.trim();
    return message.deliveryState === "pending" && !!messageId && messageId === clientId && messageId.startsWith("pending:");
  }
  confirmPendingChatMessage(pendingMessageId, message) {
    if (this.replacePendingMessage(pendingMessageId, message, true)) {
      return;
    }
    this.mergeIncomingChatMessage(message);
  }
  mergeIncomingChatMessage(message) {
    const normalizedMessage = this.normalizeChatMessage(message);
    const shouldStickToEnd = normalizedMessage.mine || this.isChatThreadNearEnd();
    if (this.confirmPendingStoredMessageEcho(normalizedMessage)) {
      return;
    }
    const matchedPendingId = this.matchPendingMessageId(normalizedMessage);
    if (matchedPendingId) {
      this.replacePendingMessage(matchedPendingId, normalizedMessage, shouldStickToEnd);
      return;
    }
    if (this.messages.some((existingMessage) => this.isSameChatMessage(existingMessage, normalizedMessage))) {
      this.replaceExistingChatMessage(normalizedMessage);
      return;
    }
    this.flagFreshMessage(normalizedMessage.id);
    this.messages = this.deduplicateChatMessages([...this.messages, normalizedMessage]).sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
    this.rebuildVisibleReadReceipts();
    this.syncEventChatSummaryFromMessage(normalizedMessage);
    this.addMessageToVisibleThreadBottom(normalizedMessage.id, shouldStickToEnd);
    this.cdr.markForCheck();
  }
  replaceExistingChatMessage(message) {
    const normalizedMessage = this.normalizeChatMessage(message);
    let changed = false;
    this.messages = this.messages.map((existingMessage) => {
      if (!this.isSameChatMessage(existingMessage, normalizedMessage)) {
        return existingMessage;
      }
      changed = true;
      const existingMessageId = `${existingMessage.id ?? ""}`.trim();
      const normalizedMessageId = `${normalizedMessage.id ?? ""}`.trim();
      const replacement = existingMessageId && normalizedMessageId && existingMessageId !== normalizedMessageId ? __spreadProps(__spreadValues({}, normalizedMessage), { id: existingMessageId }) : normalizedMessage;
      return __spreadProps(__spreadValues({}, replacement), {
        readBy: mergeChatReadAvatars(existingMessage.readBy, normalizedMessage.readBy)
      });
    });
    if (!changed) {
      return;
    }
    this.messages = this.deduplicateChatMessages(this.messages).sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
    this.rebuildVisibleReadReceipts();
    this.syncEventChatSummaryFromMessage(normalizedMessage);
    this.refreshVisibleChatThreadSurface();
    this.cdr.markForCheck();
  }
  confirmPendingStoredMessageEcho(message) {
    const messageId = `${message.id ?? ""}`.trim();
    if (!messageId) {
      return false;
    }
    const existing = this.messages.find((item) => item.id === messageId);
    if (!existing || existing.deliveryState !== "pending") {
      return false;
    }
    this.clearPendingMessageTimeout(messageId);
    this.clearPendingMessageState(messageId);
    this.syncEventChatSummaryFromMessage(existing);
    return true;
  }
  isSameChatMessage(first, second) {
    const firstId = `${first.id ?? ""}`.trim();
    const secondId = `${second.id ?? ""}`.trim();
    if (firstId && secondId && firstId === secondId) {
      return true;
    }
    const firstClientId = `${first.clientId ?? ""}`.trim();
    const secondClientId = `${second.clientId ?? ""}`.trim();
    if (firstClientId && secondClientId && firstClientId === secondClientId) {
      return true;
    }
    const firstSentAtIso = `${first.sentAtIso ?? ""}`.trim();
    const secondSentAtIso = `${second.sentAtIso ?? ""}`.trim();
    if (!firstSentAtIso || firstSentAtIso !== secondSentAtIso) {
      return false;
    }
    return `${first.senderAvatar?.id ?? ""}`.trim() === `${second.senderAvatar?.id ?? ""}`.trim() && `${first.text ?? ""}`.trim() === `${second.text ?? ""}`.trim() && this.chatMessageAttachmentIdentity(first) === this.chatMessageAttachmentIdentity(second);
  }
  deduplicateChatMessages(messages) {
    const deduped = [];
    const indexByKey = /* @__PURE__ */ new Map();
    for (const message of messages) {
      const keys = this.chatMessageIdentityKeys(message);
      const existingIndex = keys.map((key) => indexByKey.get(key)).find((index) => typeof index === "number");
      if (existingIndex === void 0) {
        const nextIndex = deduped.length;
        deduped.push(message);
        keys.forEach((key) => indexByKey.set(key, nextIndex));
        continue;
      }
      deduped[existingIndex] = this.mergeDuplicateChatMessages(deduped[existingIndex], message);
      this.chatMessageIdentityKeys(deduped[existingIndex]).forEach((key) => indexByKey.set(key, existingIndex));
    }
    return deduped;
  }
  chatMessageIdentityKeys(message) {
    const id = `${message.id ?? ""}`.trim();
    const clientId = `${message.clientId ?? ""}`.trim();
    return [
      id ? `id:${id}` : "",
      clientId ? `client:${clientId}` : ""
    ].filter(Boolean);
  }
  mergeDuplicateChatMessages(existing, candidate) {
    const existingPending = existing.deliveryState === "pending" || existing.deliveryState === "timed-out";
    const candidatePending = candidate.deliveryState === "pending" || candidate.deliveryState === "timed-out";
    const preferred = candidatePending && !existingPending ? existing : candidate;
    const fallback = preferred === existing ? candidate : existing;
    const preferredReactions = preferred.reactions ?? [];
    const fallbackReactions = fallback.reactions ?? [];
    return __spreadProps(__spreadValues({}, preferred), {
      clientId: preferred.clientId || fallback.clientId,
      reactions: preferredReactions.length >= fallbackReactions.length ? preferredReactions : fallbackReactions,
      readBy: mergeChatReadAvatars(existing.readBy, candidate.readBy)
    });
  }
  chatMessageAttachmentIdentity(message) {
    return (message.attachments ?? []).map((attachment) => [
      `${attachment.id ?? ""}`.trim(),
      `${attachment.type ?? ""}`.trim(),
      `${attachment.title ?? ""}`.trim()
    ].join(":")).join(",");
  }
  handleLiveChatEvent(chat, event) {
    if (event.type === "reconnected") {
      this.clearRemoteTypingIndicators();
      void this.resyncChatThreadFromServer(chat);
      return;
    }
    if (event.type === "typing") {
      this.applyTypingIndicator(event.typing);
      return;
    }
    if (event.type === "read") {
      this.applyReadReceipt(event.read);
      return;
    }
    if (event.type === "error") {
      this.markPendingMessageTimedOut(`${event.messageId ?? event.clientId ?? ""}`.trim());
      return;
    }
    if (event.type === "ack") {
      if (event.message) {
        this.mergeIncomingChatMessage(event.message);
      }
      return;
    }
    this.mergeIncomingChatMessage(event.message);
    if (!event.message.mine) {
      void this.markChatMessagesAsRead(chat, [event.message.id]);
    }
  }
  applyTypingIndicator(indicator) {
    const activeUserId = this.activeUserId();
    if (!indicator.userId || indicator.userId === activeUserId) {
      return;
    }
    const nextIndicators = this.typingIndicators.filter((item) => item.userId !== indicator.userId);
    if (indicator.typing) {
      nextIndicators.push(__spreadValues({}, indicator));
      this.refreshRemoteTypingExpiry(indicator.userId);
    } else {
      this.clearRemoteTypingExpiry(indicator.userId);
    }
    this.typingIndicators = nextIndicators;
    this.cdr.markForCheck();
  }
  applyReadReceipt(read) {
    if (!read.userId || read.userId === this.activeUserId()) {
      return;
    }
    const loadedMessageIds = new Set(this.messages.map((message) => message.id));
    const matchedMessageIds = new Set((read.messageIds ?? []).filter((messageId) => loadedMessageIds.has(messageId)));
    if (matchedMessageIds.size === 0) {
      return;
    }
    let changed = false;
    this.messages = this.messages.map((message) => {
      if (!message.mine || !matchedMessageIds.has(message.id)) {
        return message;
      }
      if ((message.readBy ?? []).some((reader) => reader.id === read.userId)) {
        return message;
      }
      changed = true;
      return __spreadProps(__spreadValues({}, message), {
        readBy: [
          ...message.readBy ?? [],
          {
            id: read.userId,
            initials: read.userInitials,
            gender: read.userGender
          }
        ]
      });
    });
    if (!changed) {
      return;
    }
    this.rebuildVisibleReadReceipts();
    const lastVisibleMessageId = this.latestVisibleReadMessageIdByReaderId[read.userId];
    if (lastVisibleMessageId) {
      this.flagFreshRead(lastVisibleMessageId, read.userId);
    }
    this.cdr.markForCheck();
  }
  rebuildVisibleReadReceipts() {
    for (const key of Object.keys(this.latestVisibleReadMessageIdByReaderId)) {
      delete this.latestVisibleReadMessageIdByReaderId[key];
    }
    for (const key of Object.keys(this.visibleReadReceiptsByMessageId)) {
      delete this.visibleReadReceiptsByMessageId[key];
    }
    for (let index = this.messages.length - 1; index >= 0; index -= 1) {
      const message = this.messages[index];
      if (!message.mine) {
        continue;
      }
      for (const reader of message.readBy ?? []) {
        if (!reader.id) {
          continue;
        }
        this.latestVisibleReadMessageIdByReaderId[reader.id] = message.id;
      }
    }
    for (const message of this.messages) {
      if (!message.mine || (message.readBy?.length ?? 0) === 0) {
        continue;
      }
      const visibleReaders = (message.readBy ?? []).filter((reader) => this.latestVisibleReadMessageIdByReaderId[reader.id] === message.id);
      if (visibleReaders.length > 0) {
        this.visibleReadReceiptsByMessageId[message.id] = visibleReaders;
      }
    }
  }
  resetVisibleReadReceipts() {
    for (const key of Object.keys(this.latestVisibleReadMessageIdByReaderId)) {
      delete this.latestVisibleReadMessageIdByReaderId[key];
    }
    for (const key of Object.keys(this.visibleReadReceiptsByMessageId)) {
      delete this.visibleReadReceiptsByMessageId[key];
    }
  }
  matchPendingMessageId(message) {
    if (!message.mine) {
      return null;
    }
    const normalizedClientId = `${message.clientId ?? ""}`.trim();
    if (normalizedClientId) {
      const exactPendingMatch = this.messages.find((pendingMessage) => pendingMessage.mine && (pendingMessage.deliveryState === "pending" || pendingMessage.deliveryState === "timed-out") && `${pendingMessage.clientId ?? ""}`.trim() === normalizedClientId);
      if (exactPendingMatch) {
        return exactPendingMatch.id;
      }
    }
    let matchedId = null;
    let matchedDiff = Number.POSITIVE_INFINITY;
    const messageSentAtMs = AppUtils.toSortableDate(message.sentAtIso);
    for (const pendingMessage of this.messages) {
      if (!pendingMessage.mine || pendingMessage.deliveryState !== "pending" && pendingMessage.deliveryState !== "timed-out" || pendingMessage.text !== message.text) {
        continue;
      }
      const diffMs = Math.abs(AppUtils.toSortableDate(pendingMessage.sentAtIso) - messageSentAtMs);
      if (diffMs > this.pendingMessageMatchWindowMs || diffMs >= matchedDiff) {
        continue;
      }
      matchedId = pendingMessage.id;
      matchedDiff = diffMs;
    }
    return matchedId;
  }
  replacePendingMessage(pendingMessageId, message, stickToEnd) {
    const pendingIndex = this.messages.findIndex((existingMessage) => existingMessage.id === pendingMessageId);
    if (pendingIndex < 0) {
      return false;
    }
    this.clearPendingMessageTimeout(pendingMessageId);
    const pendingMessage = this.messages[pendingIndex];
    const pendingClientId = pendingMessage?.clientId;
    const hasQueuedReaction = this.queuedReactionByPendingMessageId.has(pendingMessageId);
    const queuedReactionEmoji = hasQueuedReaction ? this.queuedReactionByPendingMessageId.get(pendingMessageId) ?? null : null;
    const resolvedMessage = this.normalizeChatMessage(message);
    const normalizedMessage = resolvedMessage.mine ? __spreadProps(__spreadValues({}, resolvedMessage), {
      sender: pendingMessage?.sender ?? resolvedMessage.sender,
      senderAvatar: pendingMessage?.senderAvatar ?? resolvedMessage.senderAvatar
    }) : resolvedMessage;
    const nextMessage = __spreadProps(__spreadValues({}, normalizedMessage), {
      id: `${normalizedMessage.id ?? ""}`.trim() || pendingMessageId,
      clientId: pendingClientId || normalizedMessage.clientId,
      reactions: hasQueuedReaction ? pendingMessage?.reactions ?? [] : normalizedMessage.reactions,
      readBy: mergeChatReadAvatars(pendingMessage?.readBy, normalizedMessage.readBy),
      deliveryState: hasQueuedReaction ? "pending" : normalizedMessage.deliveryState
    });
    let nextMessages = [...this.messages];
    const duplicateIndex = nextMessages.findIndex((existingMessage, index) => index !== pendingIndex && existingMessage.id === nextMessage.id);
    if (duplicateIndex >= 0) {
      nextMessages[duplicateIndex] = __spreadProps(__spreadValues({}, nextMessage), {
        readBy: mergeChatReadAvatars(nextMessages[duplicateIndex].readBy, nextMessage.readBy)
      });
      nextMessages = nextMessages.filter((_existingMessage, index) => index !== pendingIndex);
    } else {
      nextMessages[pendingIndex] = nextMessage;
    }
    this.messages = this.deduplicateChatMessages(nextMessages).sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
    this.rebuildVisibleReadReceipts();
    this.syncEventChatSummaryFromMessage(nextMessage);
    this.addMessageToVisibleThreadBottom(nextMessage.id, stickToEnd);
    this.cdr.markForCheck();
    if (hasQueuedReaction) {
      this.flushQueuedReactionForStoredMessage(pendingMessageId, nextMessage.id, queuedReactionEmoji);
    }
    return true;
  }
  flushQueuedReactionForStoredMessage(pendingMessageId, storedMessageId, reactionEmoji) {
    this.queuedReactionByPendingMessageId.delete(pendingMessageId);
    const normalizedStoredMessageId = `${storedMessageId ?? ""}`.trim();
    if (!normalizedStoredMessageId) {
      return;
    }
    const session = this.session();
    if (!session) {
      this.clearPendingMessageState(normalizedStoredMessageId);
      return;
    }
    this.schedulePendingMessageTimeout(normalizedStoredMessageId);
    const mutationSequence = (this.reactionMutationSequenceByMessageId.get(normalizedStoredMessageId) ?? 0) + 1;
    this.reactionMutationSequenceByMessageId.set(normalizedStoredMessageId, mutationSequence);
    void this.chatsService.updateChatMessage(session.item, normalizedStoredMessageId, { reactionEmoji }).then((updated) => {
      if (this.reactionMutationSequenceByMessageId.get(normalizedStoredMessageId) !== mutationSequence) {
        return;
      }
      if (updated) {
        this.clearPendingMessageTimeout(normalizedStoredMessageId);
        this.clearPendingMessageState(normalizedStoredMessageId);
      }
      this.reactionMutationSequenceByMessageId.delete(normalizedStoredMessageId);
    }).catch(() => {
      if (this.reactionMutationSequenceByMessageId.get(normalizedStoredMessageId) === mutationSequence) {
        this.reactionMutationSequenceByMessageId.delete(normalizedStoredMessageId);
      }
    });
  }
  async resyncChatThreadFromServer(chat) {
    const sessionKey = this.loadedSessionKey;
    if (!sessionKey) {
      return;
    }
    const shouldStickToEnd = this.isChatThreadNearEnd();
    try {
      const snapshot = await this.chatsService.loadChatMessagesResult(chat, {
        page: 0,
        pageSize: this.chatInitialLoadMessageCount
      });
      if (this.loadedSessionKey !== sessionKey) {
        return;
      }
      const mergedMessages = this.mergeServerSnapshotWithPendingMessages(snapshot.items);
      this.messages = mergedMessages.sort((first, second) => AppUtils.toSortableDate(second.sentAtIso) - AppUtils.toSortableDate(first.sentAtIso));
      this.rebuildVisibleReadReceipts();
      this.syncEventChatSummaryFromLatestMessage();
      if (shouldStickToEnd) {
        this.scheduleChatThreadScrollToEnd();
      }
      this.refreshVisibleChatThreadSurface();
      this.cdr.markForCheck();
    } catch {
    }
  }
  mergeServerSnapshotWithPendingMessages(snapshot) {
    const matchedPendingIds = /* @__PURE__ */ new Set();
    const snapshotMessages = snapshot.map((message) => {
      const liveMessage = this.messages.find((existingMessage) => this.isSameChatMessage(existingMessage, message));
      const messageWithLiveReadState = __spreadProps(__spreadValues({}, message), {
        readBy: mergeChatReadAvatars(liveMessage?.readBy, message.readBy)
      });
      const pendingId = this.matchPendingMessageId(messageWithLiveReadState);
      if (!pendingId) {
        return messageWithLiveReadState;
      }
      matchedPendingIds.add(pendingId);
      this.clearPendingMessageTimeout(pendingId);
      const pendingMessage = this.messages.find((existingMessage) => existingMessage.id === pendingId);
      return this.normalizeChatMessage(__spreadProps(__spreadValues({}, messageWithLiveReadState), {
        clientId: pendingMessage?.clientId,
        readBy: mergeChatReadAvatars(pendingMessage?.readBy, messageWithLiveReadState.readBy)
      }));
    });
    const unresolvedPendingMessages = this.messages.filter((message) => (message.deliveryState === "pending" || message.deliveryState === "timed-out") && !matchedPendingIds.has(message.id));
    return [...this.normalizeChatMessages(snapshotMessages), ...unresolvedPendingMessages];
  }
  schedulePendingMessageTimeout(messageId) {
    this.clearPendingMessageTimeout(messageId);
    this.pendingMessageTimeouts.set(messageId, setTimeout(() => {
      this.pendingMessageTimeouts.delete(messageId);
      this.markPendingMessageTimedOut(messageId);
    }, this.pendingMessageTimeoutMs));
  }
  clearPendingMessageTimeout(messageId) {
    const timer = this.pendingMessageTimeouts.get(messageId);
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    this.pendingMessageTimeouts.delete(messageId);
  }
  clearPendingMessageTimers() {
    for (const timer of this.pendingMessageTimeouts.values()) {
      clearTimeout(timer);
    }
    this.pendingMessageTimeouts.clear();
  }
  markPendingMessageTimedOut(messageId) {
    const pendingIndex = this.messages.findIndex((message) => message.id === messageId && message.deliveryState === "pending");
    if (pendingIndex < 0) {
      return;
    }
    const nextMessages = [...this.messages];
    nextMessages[pendingIndex] = __spreadProps(__spreadValues({}, nextMessages[pendingIndex]), {
      deliveryState: "timed-out"
    });
    this.messages = nextMessages;
    this.refreshVisibleChatThreadSurface();
    this.cdr.markForCheck();
  }
  clearPendingMessageState(messageId) {
    const normalizedMessageId = `${messageId ?? ""}`.trim();
    if (!normalizedMessageId) {
      return;
    }
    let changed = false;
    this.messages = this.messages.map((message) => {
      if (message.id !== normalizedMessageId || message.deliveryState !== "pending") {
        return message;
      }
      changed = true;
      return __spreadProps(__spreadValues({}, message), {
        deliveryState: void 0
      });
    });
    if (!changed) {
      return;
    }
    this.refreshVisibleChatThreadSurface();
    this.cdr.markForCheck();
  }
  refreshVisibleChatThreadSurface() {
    const previousTotal = this.visibleChatThreadTotal;
    const nextTotal = this.messages.length;
    this.visibleChatThreadTotal = nextTotal;
    if (this.chatThreadKnownTotal > previousTotal && nextTotal > previousTotal) {
      this.chatThreadKnownTotal += nextTotal - previousTotal;
    }
    const visibleTotal = this.chatThreadVisibleTotal();
    const smartList = this.chatThreadSmartList;
    if (!smartList) {
      this.chatThreadRevision++;
      this.syncChatThreadQuery();
      return;
    }
    const latestMessageById = new Map(this.messages.map((message) => [message.id, message]));
    const currentVisibleItems = smartList.itemsSnapshot().map((message) => latestMessageById.get(message.id) ?? message).filter((message) => latestMessageById.has(message.id));
    if (currentVisibleItems.length === 0) {
      const nextVisibleCount = Math.min(nextTotal, this.chatInitialLoadMessageCount);
      if (nextVisibleCount === 0) {
        smartList.replaceVisibleItems([], { total: 0 });
        return;
      }
      smartList.replaceVisibleItems(this.messages.slice(0, nextVisibleCount), { total: visibleTotal });
      return;
    }
    const addedCount = Math.max(0, nextTotal - previousTotal);
    const visibleMessageIds = new Set(currentVisibleItems.map((message) => message.id));
    const addedBottomItems = addedCount > 0 ? this.messages.filter((message) => !visibleMessageIds.has(message.id)).slice(0, addedCount) : [];
    const nextVisibleItems = addedBottomItems.length > 0 ? [...addedBottomItems, ...currentVisibleItems] : currentVisibleItems;
    if (nextVisibleItems.length === 0) {
      smartList.replaceVisibleItems([], { total: 0 });
      return;
    }
    smartList.replaceVisibleItems(nextVisibleItems, { total: visibleTotal });
  }
  addMessageToVisibleThreadBottom(messageId, stickToEnd) {
    const normalizedMessageId = `${messageId ?? ""}`.trim();
    const smartList = this.chatThreadSmartList;
    if (!smartList) {
      this.chatThreadRevision++;
      this.syncChatThreadQuery();
      return;
    }
    const latestMessageById = new Map(this.messages.map((message) => [message.id, message]));
    const currentVisibleItems = smartList.itemsSnapshot().map((message) => latestMessageById.get(message.id) ?? message).filter((message) => latestMessageById.has(message.id));
    const bottomMessage = normalizedMessageId ? latestMessageById.get(normalizedMessageId) : null;
    const nextVisibleItems = bottomMessage && !currentVisibleItems.some((message) => message.id === bottomMessage.id) ? [bottomMessage, ...currentVisibleItems] : currentVisibleItems;
    smartList.replaceVisibleItems(nextVisibleItems, {
      total: this.chatThreadVisibleTotal()
    });
    this.visibleChatThreadTotal = this.messages.length;
    if (stickToEnd) {
      this.scheduleChatThreadScrollToEnd();
    }
  }
  flagFreshMessage(messageId) {
    if (!messageId) {
      return;
    }
    this.freshMessageIds.add(messageId);
    setTimeout(() => {
      this.freshMessageIds.delete(messageId);
      this.cdr.markForCheck();
    }, this.chatTransientFxMs);
  }
  flagFreshRead(messageId, readerId) {
    const key = `${messageId}:${readerId}`;
    this.freshReadKeys.add(key);
    setTimeout(() => {
      this.freshReadKeys.delete(key);
      this.cdr.markForCheck();
    }, this.chatTransientFxMs);
  }
  clearTransientMessageState() {
    this.freshMessageIds.clear();
    this.freshReadKeys.clear();
  }
  activeUserId() {
    return this.userProfileStore.activeUserId().trim();
  }
  applyLoadedChatReadReceipt(chat, page) {
    const read = page.context?.readReceipt ?? null;
    if (read) {
      this.applyOwnReadReceiptToActivityRow(chat, read);
    }
  }
  async markChatMessagesAsRead(chat, messageIds) {
    const read = await this.chatsService.markChatRead(chat, messageIds).catch(() => null);
    if (read) {
      this.applyOwnReadReceiptToActivityRow(chat, read);
    }
  }
  syncEventChatSummaryFromLatestMessage() {
    const latestMessage = this.messages[0];
    if (!latestMessage) {
      return;
    }
    this.syncEventChatSummaryFromMessage(latestMessage);
  }
  syncEventChatSummaryFromMessage(message) {
    const session = this.session();
    if (!session) {
      return;
    }
    if (message.deliveryState === "pending" || message.deliveryState === "timed-out") {
      return;
    }
    const nextLastMessage = `${message.text ?? ""}`.trim() || this.chatAttachmentSummary(message);
    const nextDateIso = `${message.sentAtIso ?? ""}`.trim();
    const nextLastSenderId = this.resolveChatMessageSenderId(message, session.item.lastSenderId);
    if (!nextLastMessage && !nextDateIso && !nextLastSenderId) {
      return;
    }
    this.activitiesStore.emitEventChatRowPatch({
      chatId: session.item.id,
      ownerId: session.item.ownerId ?? null,
      channelType: session.item.channelType ?? null,
      lastMessage: nextLastMessage || void 0,
      lastSenderId: nextLastSenderId || void 0,
      dateIso: nextDateIso || void 0
    });
  }
  applyOwnReadReceiptToActivityRow(chat, read) {
    const activeUserId = this.activeUserId();
    if (!read.userId || read.userId !== activeUserId) {
      return;
    }
    if (read.unread === void 0 || read.unread === null) {
      return;
    }
    const previousUnread = this.currentChatUnread(chat);
    const nextUnread = this.normalizeUnreadCounter(read.unread);
    const unreadDelta = nextUnread - previousUnread;
    this.activitiesStore.emitEventChatRowPatch({
      chatId: chat.id,
      ownerId: chat.ownerId ?? null,
      channelType: chat.channelType ?? null,
      unread: nextUnread,
      unreadDelta
    });
    this.patchCurrentEventChatHeader((header) => `${header.chatId ?? ""}`.trim() === `${chat.id ?? ""}`.trim() ? __spreadProps(__spreadValues({}, header), { unread: nextUnread }) : header);
  }
  currentChatUnread(chat) {
    const normalizedChatId = `${chat.id ?? ""}`.trim();
    const sessionItem = this.session()?.item ?? null;
    if (normalizedChatId && `${sessionItem?.id ?? ""}`.trim() === normalizedChatId) {
      return this.normalizeUnreadCounter(sessionItem?.unread);
    }
    return this.normalizeUnreadCounter(chat.unread);
  }
  normalizeUnreadCounter(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  }
  resolveChatMessageSenderId(message, fallbackSenderId) {
    if (message.mine) {
      return this.activeUserId() || fallbackSenderId;
    }
    const senderId = `${message.senderAvatar?.id ?? ""}`.trim();
    return senderId || fallbackSenderId;
  }
  normalizeChatMessages(messages) {
    return messages.map((message, index) => this.normalizeChatMessage(message, index));
  }
  normalizeChatMessage(message, fallbackIndex = null) {
    const normalizedMessage = this.withResolvedChatMessageId(message, fallbackIndex);
    if (normalizedMessage.deletedAtIso) {
      return __spreadProps(__spreadValues({}, normalizedMessage), {
        text: "",
        readBy: [],
        reactions: [],
        attachments: [],
        replyTo: null,
        editedAtIso: null,
        pinnedAtIso: null,
        pinnedByUserId: null
      });
    }
    if (!normalizedMessage.mine) {
      return normalizedMessage;
    }
    const senderPresentation = this.resolveOptimisticSenderPresentation(normalizedMessage.senderAvatar?.id || this.activeUserId());
    const senderAvatar = normalizedMessage.senderAvatar;
    return __spreadProps(__spreadValues({}, normalizedMessage), {
      sender: senderPresentation.sender,
      senderAvatar: {
        id: `${senderAvatar?.id ?? ""}`.trim() || senderPresentation.senderAvatar.id,
        initials: `${senderAvatar?.initials ?? ""}`.trim() || senderPresentation.senderAvatar.initials,
        gender: senderAvatar?.gender ?? senderPresentation.senderAvatar.gender,
        imageUrl: senderAvatar?.imageUrl ?? senderPresentation.senderAvatar.imageUrl ?? null
      }
    });
  }
  withResolvedChatMessageId(message, _fallbackIndex) {
    const messageId = `${message.id ?? ""}`.trim();
    if (messageId) {
      return messageId === message.id ? message : __spreadProps(__spreadValues({}, message), { id: messageId });
    }
    const attachmentKey = (message.attachments ?? []).map((attachment) => [
      `${attachment.id ?? ""}`.trim(),
      `${attachment.type ?? ""}`.trim(),
      `${attachment.title ?? ""}`.trim()
    ].join(":")).join(",");
    const seed = [
      `${this.session()?.item.id ?? ""}`.trim(),
      `${message.senderAvatar?.id ?? ""}`.trim(),
      `${message.sentAtIso ?? ""}`.trim(),
      `${message.text ?? ""}`.trim(),
      attachmentKey
    ].join("|");
    return __spreadProps(__spreadValues({}, message), {
      id: `chat-message:${AppUtils.hashText(seed)}`
    });
  }
  chatAttachmentSummary(message) {
    const firstAttachment = message.attachments?.[0];
    if (!firstAttachment) {
      return "";
    }
    switch (firstAttachment.type) {
      case "image":
        return "Sent an image";
      case "event":
        return this.attachmentReferenceLabel(firstAttachment, "Event");
      case "asset":
        return this.attachmentReferenceLabel(firstAttachment, "Asset");
      case "poll":
        return "Created a poll";
      case "voice":
        return "Sent a voice clip";
      default:
        return firstAttachment.title || "Shared a link";
    }
  }
  resolveOptimisticSenderPresentation(activeUserId) {
    const activeUser = this.userProfileStore.activeUserProfile() ?? (activeUserId ? this.userProfileStore.getUserProfile(activeUserId) : null);
    const initials = activeUser?.initials?.trim() || AppUtils.initialsFromText(activeUser?.name ?? "Me");
    return {
      sender: "You",
      senderAvatar: {
        id: activeUser?.id?.trim() || activeUserId || "self",
        initials: initials || "ME",
        gender: activeUser?.gender ?? "man",
        imageUrl: AppUtils.mediaImageVariantUrl(activeUser?.images?.map((image) => image.trim()).find(Boolean), "small") || null
      }
    };
  }
  refreshRemoteTypingExpiry(userId) {
    this.clearRemoteTypingExpiry(userId);
    this.remoteTypingExpiryByUserId[userId] = setTimeout(() => {
      this.typingIndicators = this.typingIndicators.filter((item) => item.userId !== userId);
      this.remoteTypingExpiryByUserId[userId] = null;
      this.cdr.markForCheck();
    }, this.chatTypingRemoteTtlMs);
  }
  clearRemoteTypingExpiry(userId) {
    const existing = this.remoteTypingExpiryByUserId[userId];
    if (!existing) {
      return;
    }
    clearTimeout(existing);
    this.remoteTypingExpiryByUserId[userId] = null;
  }
  clearRemoteTypingIndicators() {
    for (const [userId, timer] of Object.entries(this.remoteTypingExpiryByUserId)) {
      if (timer) {
        clearTimeout(timer);
      }
      this.remoteTypingExpiryByUserId[userId] = null;
    }
    this.typingIndicators = [];
  }
  clearTypingIdleTimer() {
    if (!this.typingIdleTimer) {
      return;
    }
    clearTimeout(this.typingIdleTimer);
    this.typingIdleTimer = null;
  }
  stopLocalTyping() {
    this.clearTypingIdleTimer();
    if (!this.localTypingActive) {
      return;
    }
    this.localTypingActive = false;
    const session = this.session();
    if (session) {
      void this.chatsService.sendChatTyping(session.item, false);
    }
  }
  closeTransientMessageUi(options = {}) {
    this.chatThreadSmartList?.closeMenu();
    if (this.voiceComposerOpen) {
      this.resetVoiceRecorder();
    }
    if (this.pollComposerOpen) {
      this.closePollComposer();
    }
    this.selectedMessageId = "";
    this.selectedMessageToolsDown = false;
    this.quickReactionMessageId = "";
    this.quickReactionOpenDown = false;
    this.reactionDetailsMessageId = "";
    this.closePollVoteDialog();
    if (!options.keepEditing) {
      this.editingMessageId = "";
    }
  }
  blurEventTarget(event) {
    const target = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event?.target instanceof HTMLElement ? event.target : null;
    target?.blur();
  }
  async finalizeVoiceRecording() {
    this.clearVoiceRecorderTimer();
    this.stopVoiceRecorderStream();
    const blob = new Blob(this.voiceRecorderChunks, { type: this.voiceClipMimeType || "audio/webm" });
    this.voiceClipSizeBytes = blob.size;
    this.voiceClipDataUrl = blob.size > 0 ? await this.blobToDataUrl(blob) : "";
    this.voiceRecordingState = this.voiceClipDataUrl ? "recorded" : "idle";
    this.voiceRecorder = null;
    this.voiceRecorderChunks = [];
    if (!this.voiceClipDataUrl) {
      this.voiceRecorderError = "No audio was recorded.";
    }
    this.cdr.markForCheck();
  }
  resetVoiceRecorder(options = {}) {
    this.clearVoiceRecorderTimer();
    const recorder = this.voiceRecorder;
    this.voiceRecorder = null;
    if (recorder?.state === "recording") {
      recorder.onstop = null;
      recorder.stop();
    }
    this.stopVoiceRecorderStream();
    this.voiceRecorderChunks = [];
    this.voiceRecordingState = "idle";
    this.voiceRecorderSeconds = 0;
    if (!options.keepError) {
      this.voiceRecorderError = "";
    }
    this.voiceClipDataUrl = "";
    this.voiceClipMimeType = "";
    this.voiceClipSizeBytes = 0;
    this.voiceComposerOpen = options.keepOpen === true;
  }
  clearVoiceRecorderTimer() {
    if (!this.voiceRecorderTimer) {
      return;
    }
    clearInterval(this.voiceRecorderTimer);
    this.voiceRecorderTimer = null;
  }
  stopVoiceRecorderStream() {
    this.voiceRecorderStream?.getTracks().forEach((track) => track.stop());
    this.voiceRecorderStream = null;
  }
  preferredVoiceRecorderOptions() {
    const candidates = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
    const mimeType = candidates.find((candidate) => {
      try {
        return MediaRecorder.isTypeSupported(candidate);
      } catch {
        return false;
      }
    });
    return mimeType ? { mimeType } : void 0;
  }
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(`${reader.result ?? ""}`);
      reader.onerror = () => reject(reader.error ?? new Error("Unable to read voice clip."));
      reader.readAsDataURL(blob);
    });
  }
  formatVoiceDuration(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return `${minutes}:${remainder.toString().padStart(2, "0")}`;
  }
  bindChatThreadScrollDismissListener() {
    const scrollElement = this.chatThreadSmartList?.scrollElement() ?? null;
    if (!scrollElement || scrollElement === this.chatThreadScrollDismissElement) {
      return;
    }
    this.clearChatThreadScrollDismissListener();
    this.chatThreadScrollDismissElement = scrollElement;
    scrollElement.addEventListener("scroll", this.dismissMessageUiOnChatScroll, { passive: true });
  }
  clearChatThreadScrollDismissListener() {
    this.chatThreadScrollDismissElement?.removeEventListener("scroll", this.dismissMessageUiOnChatScroll);
    this.chatThreadScrollDismissElement = null;
  }
  isMobileInputMode() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(hover: none), (pointer: coarse), (max-width: 760px)").matches;
  }
  focusComposerSoon() {
    setTimeout(() => {
      this.messageTextarea?.nativeElement.focus();
    }, 0);
  }
  resizeComposerTextareaSoon() {
    setTimeout(() => this.resizeComposerTextarea(), 0);
  }
  chatDayLabel(value) {
    if (Number.isNaN(value.getTime())) {
      return "Unknown day";
    }
    const day = AppUtils.dateOnly(value);
    const current = AppUtils.dateOnly(/* @__PURE__ */ new Date());
    if (AppUtils.toIsoDate(day) === AppUtils.toIsoDate(current)) {
      return "Today";
    }
    const yesterday = AppUtils.addDays(current, -1);
    if (AppUtils.toIsoDate(day) === AppUtils.toIsoDate(yesterday)) {
      return "Yesterday";
    }
    return day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  syncSelectedChatHeader(chat) {
    if (!chat) {
      this.chatHeaderContext = null;
      this.selectedChatNavigationState = null;
      this.resolvedChatEventRecord = null;
      this.resolvedChatEventRecordKey = "";
      this.resolvedChatResourceState = null;
      this.resolvedChatResourceStateKey = "";
      this.resolvedChatGroupSnapshot = null;
      this.resolvedChatGroupSnapshotKey = "";
      return;
    }
    this.selectedChatNavigationState = this.buildSelectedChatNavigationState(chat);
    this.chatHeaderContext = this.buildSelectedChatHeaderContext(chat, this.selectedChatNavigationState);
  }
  buildSelectedChatHeaderContext(chat, state, loadedContext = null) {
    const baseContext = loadedContext ? this.clonePopupHeaderContext(loadedContext) : ChatPopupHeaderContextConverter.convert(chat, { includeThumbs: true });
    const controls = [...(baseContext.controls ?? []).map((control) => __spreadValues({}, control))];
    if (chat.channelType === "appSupport") {
      if (this.canShareWorkspaceWithSupport()) {
        controls.push(this.buildAppSupportChatContextControl());
      }
    } else if (!this.isServiceChat() && !this.isBlockedSupportChat()) {
      controls.push(this.buildSelectedChatContextControl(chat, state));
    }
    return __spreadProps(__spreadValues({}, baseContext), {
      title: state?.channelType === "groupSubEvent" ? this.selectedChatGroupDisplayLabel(chat, state) : baseContext.title,
      controls
    });
  }
  clonePopupHeaderContext(context) {
    return __spreadProps(__spreadValues({}, context), {
      titleBadge: context.titleBadge ? __spreadValues({}, context.titleBadge) : null,
      controls: (context.controls ?? []).map((control) => __spreadProps(__spreadValues({}, control), {
        badge: control.badge ? __spreadValues({}, control.badge) : null,
        lookup: control.lookup ? __spreadValues({}, control.lookup) : null,
        visual: control.visual?.kind === "thumbStack" ? __spreadProps(__spreadValues({}, control.visual), {
          thumbs: control.visual.thumbs.map((thumb) => __spreadValues({}, thumb))
        }) : control.visual ? __spreadValues({}, control.visual) : null,
        menu: control.menu ? __spreadProps(__spreadValues({}, control.menu), {
          groups: control.menu.groups.map((group) => __spreadProps(__spreadValues({}, group), {
            controls: group.controls.map((menuControl) => __spreadProps(__spreadValues({}, menuControl), {
              badge: menuControl.badge ? __spreadValues({}, menuControl.badge) : null,
              lookup: menuControl.lookup ? __spreadValues({}, menuControl.lookup) : null,
              visual: menuControl.visual ? __spreadValues({}, menuControl.visual) : null
            }))
          }))
        }) : null
      }))
    });
  }
  buildSelectedChatContextControl(chat, state) {
    const primaryControl = this.buildSelectedChatPrimaryControl(chat, state);
    const menu = state ? this.buildSelectedChatControlMenu(state, primaryControl) : null;
    return __spreadProps(__spreadValues({}, primaryControl), {
      id: "chat-context",
      menu
    });
  }
  buildAppSupportChatContextControl() {
    return {
      id: "chat-context",
      label: this.i18n.translate("app.support"),
      summary: this.i18n.translate("event.chat.support.share.workspace"),
      visual: { kind: "icon", icon: "admin_panel_settings" },
      menu: {
        title: this.i18n.translate("app.support"),
        groups: [{
          id: "support",
          controls: [{
            id: "app-support-share-workspace",
            label: this.i18n.translate("event.chat.support.share.workspace"),
            summary: this.i18n.translate("event.chat.support.share.workspace.summary"),
            visual: { kind: "icon", icon: "vpn_key" },
            lookup: {
              type: "adminHelp",
              id: "current"
            }
          }]
        }]
      }
    };
  }
  buildSelectedChatPrimaryControl(chat, state) {
    const channelType = state?.channelType ?? this.chatChannelType(chat);
    const label = channelType === "groupSubEvent" ? this.selectedChatGroupDisplayLabel(chat, state) : channelType === "optionalSubEvent" ? state?.subEvent?.name ?? "Sub-event" : "View Event";
    const icon = channelType === "groupSubEvent" ? "groups" : channelType === "optionalSubEvent" ? "event_available" : "event";
    const badgeValue = this.selectedChatActionBadgeCount(chat, state);
    return {
      id: "chat-primary",
      label,
      visual: { kind: "icon", icon },
      badge: badgeValue > 0 ? { value: badgeValue, tone: "danger" } : null,
      lookup: {
        type: "chatPrimary",
        id: `${state?.eventId ?? this.chatOwnerParts(chat).eventId ?? chat.id}`.trim()
      }
    };
  }
  buildSelectedChatControlMenu(state, primaryControl) {
    if (!state.subEvent || state.channelType !== "optionalSubEvent" && state.channelType !== "groupSubEvent") {
      return null;
    }
    const assetControls = ASSET_TYPES.map((type) => this.buildResourceControl(state.subEvent, state, type));
    return {
      title: primaryControl.label || state.subEvent.name,
      groups: [
        {
          id: "primary",
          controls: [__spreadValues({}, primaryControl)]
        },
        {
          id: "members",
          controls: [this.buildResourceControl(state.subEvent, state, "Members")]
        },
        {
          id: "assets",
          label: "Assets",
          controls: assetControls
        }
      ]
    };
  }
  buildResourceControl(subEvent, state, type) {
    const metricsBucket = this.chatMetricsBucket(state.metrics, type);
    const pending = metricsBucket ? this.chatCountValue(metricsBucket.pending) : this.resourcePendingCount(subEvent, state, type);
    return {
      id: `chat-resource-${type.toLowerCase()}`,
      label: this.resourceTypeLabel(type),
      summary: metricsBucket ? this.chatMetricsBucketSummary(metricsBucket) : this.resourceSummary(subEvent, state, type),
      visual: { kind: "icon", icon: this.resourceTypeIcon(type) },
      badge: pending > 0 ? { value: pending, tone: "danger" } : null,
      lookup: {
        type: "chatResource",
        id: type
      }
    };
  }
  buildSelectedChatNavigationState(chat) {
    const ownerParts = this.chatOwnerParts(chat);
    const navigationContext = chat.navigationContext ?? null;
    const eventId = navigationContext?.eventId ?? ownerParts.eventId;
    const eventRecord = this.resolveSelectedChatEventRecord(chat);
    const rawSubEvent = this.resolveSelectedChatSubEvent(chat, eventRecord);
    const resourceState = rawSubEvent && eventId ? this.resolveSelectedChatResourceState(eventId, rawSubEvent.id) : null;
    const assetCardsByType = ActivityResourceBuilder.cloneFallbackAssetCardsByType(resourceState?.fallbackAssetCardsByType);
    const assetCards = this.flattenAssetCards(assetCardsByType);
    const subEvent = rawSubEvent ? this.syncSubEventResourceCounts(this.cloneSubEvent(rawSubEvent), resourceState, assetCards) : null;
    const metricsSubEvent = subEvent ? this.applyChatMetricsToSubEvent(subEvent, chat.metrics) : null;
    return {
      channelType: this.chatChannelType(chat),
      eventId: (eventRecord?.id ?? navigationContext?.eventId ?? eventId) || null,
      eventTarget: eventRecord ? this.eventEditorTargetForRecord(eventRecord) : navigationContext?.eventTarget ?? "events",
      eventTitle: eventRecord?.title ?? navigationContext?.eventTitle ?? chat.title ?? null,
      eventPendingMembers: this.chatMetricCount(navigationContext?.eventPendingMembers ?? eventRecord?.pendingMembers),
      subEvent: metricsSubEvent,
      group: this.applyChatMetricsToGroup(this.resolveSelectedChatGroup(chat, metricsSubEvent, (eventRecord?.id ?? eventId) || null), chat.metrics),
      assetAssignmentIds: ActivityResourceBuilder.cloneAssetAssignmentIds(resourceState?.assetAssignmentIds),
      assetCardsByType,
      metrics: chat.metrics ?? null
    };
  }
  applyChatMetricsToSubEvent(subEvent, metrics) {
    if (!metrics) {
      return subEvent;
    }
    return __spreadProps(__spreadValues({}, subEvent), {
      membersAccepted: metrics.members?.accepted ?? subEvent.membersAccepted,
      membersPending: metrics.members?.pending ?? subEvent.membersPending,
      capacityMin: metrics.members?.capacityMin ?? subEvent.capacityMin,
      capacityMax: metrics.members?.capacityMax ?? subEvent.capacityMax,
      carsAccepted: metrics.transport?.accepted ?? subEvent.carsAccepted,
      carsPending: metrics.transport?.pending ?? subEvent.carsPending,
      carsCapacityMin: metrics.transport?.capacityMin ?? subEvent.carsCapacityMin,
      carsCapacityMax: metrics.transport?.capacityMax ?? subEvent.carsCapacityMax,
      accommodationAccepted: metrics.accommodation?.accepted ?? subEvent.accommodationAccepted,
      accommodationPending: metrics.accommodation?.pending ?? subEvent.accommodationPending,
      accommodationCapacityMin: metrics.accommodation?.capacityMin ?? subEvent.accommodationCapacityMin,
      accommodationCapacityMax: metrics.accommodation?.capacityMax ?? subEvent.accommodationCapacityMax,
      suppliesAccepted: metrics.supplies?.accepted ?? subEvent.suppliesAccepted,
      suppliesPending: metrics.supplies?.pending ?? subEvent.suppliesPending,
      suppliesCapacityMin: metrics.supplies?.capacityMin ?? subEvent.suppliesCapacityMin,
      suppliesCapacityMax: metrics.supplies?.capacityMax ?? subEvent.suppliesCapacityMax,
      groupsCount: metrics.groupsCount ?? subEvent.groupsCount
    });
  }
  applyChatMetricsToGroup(group, metrics) {
    if (!group || !metrics?.members) {
      return group;
    }
    return __spreadProps(__spreadValues({}, group), {
      accepted: metrics.members.accepted,
      pending: metrics.members.pending,
      capacityMin: metrics.members.capacityMin,
      capacityMax: metrics.members.capacityMax
    });
  }
  selectedChatEventRecord(eventId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    if (!normalizedEventId) {
      return null;
    }
    if (this.resolvedChatEventRecordKey === normalizedEventId) {
      return this.resolvedChatEventRecord;
    }
    return this.eventsService.peekKnownRecordById(this.activeUserId(), normalizedEventId);
  }
  selectedChatEventEditorTarget(record, state) {
    return record ? this.eventEditorTargetForRecord(record) : state?.eventTarget ?? "events";
  }
  canEditSelectedChatEvent(record, state) {
    return this.selectedChatEventEditorAction(record, state) !== "view";
  }
  selectedChatEventEditorAction(record, state) {
    const subject = this.selectedChatEventMenuSubject(record, state);
    return ActivityEventInfoCardMenuConverter.eventEditorAction(subject, {
      activeUserId: this.activeUserId()
    });
  }
  selectedChatEventMenuSubject(record, state) {
    const eventId = `${record?.id ?? state?.eventId ?? this.selectedChatOwnerParts().eventId}`.trim();
    if (!eventId) {
      return null;
    }
    return {
      menu: "activity-event-card",
      id: eventId,
      status: record?.status ?? null,
      ownerUserId: record?.creatorUserId ?? null,
      adminIds: [...record?.adminIds ?? []],
      acceptedMemberUserIds: [...record?.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record?.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record?.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record?.pendingRequestMemberUserIds ?? []],
      activity: record?.activity ?? 0,
      eventScope: record?.type ?? null
    };
  }
  eventEditorTargetForRecord(record) {
    const activeUserId = this.activeUserId().trim();
    if (record.type === "hosting" || !!activeUserId && record.creatorUserId === activeUserId || (record.adminIds ?? []).includes(activeUserId)) {
      return "hosting";
    }
    return "events";
  }
  chatChannelType(chat) {
    const channelType = `${chat.channelType ?? ""}`.trim();
    if (channelType === "general" || channelType === "mainEvent" || channelType === "optionalSubEvent" || channelType === "groupSubEvent" || channelType === "serviceEvent" || channelType === "appSupport" || channelType === "supportCase") {
      return channelType;
    }
    if (chat.serviceContext === "event" || chat.serviceContext === "asset" || chat.serviceContext === "notification") {
      return "serviceEvent";
    }
    const ownerParts = this.splitChatOwnerId(chat.ownerId);
    if (ownerParts.length >= 3) {
      return "groupSubEvent";
    }
    if (ownerParts.length === 2) {
      return "optionalSubEvent";
    }
    return ownerParts.length === 1 ? "mainEvent" : "general";
  }
  chatOwnerParts(chat) {
    const ownerId = `${chat?.ownerId ?? ""}`.trim();
    if (!chat || !ownerId) {
      return { ownerId, eventId: "", subEventId: "", groupId: "" };
    }
    const channelType = this.chatChannelType(chat);
    const parts = this.splitChatOwnerId(ownerId);
    if (channelType === "groupSubEvent") {
      return {
        ownerId,
        eventId: `${chat.eventId ?? parts[0] ?? ""}`.trim(),
        subEventId: `${chat.subEventId ?? parts[1] ?? ""}`.trim(),
        groupId: `${chat.groupId ?? parts.slice(2).join(":")}`.trim()
      };
    }
    if (channelType === "optionalSubEvent") {
      return {
        ownerId,
        eventId: `${chat.eventId ?? parts[0] ?? ""}`.trim(),
        subEventId: `${chat.subEventId ?? parts.slice(1).join(":")}`.trim(),
        groupId: ""
      };
    }
    if (channelType === "mainEvent" || channelType === "serviceEvent") {
      return { ownerId, eventId: `${chat.eventId ?? ownerId}`.trim(), subEventId: "", groupId: "" };
    }
    return { ownerId, eventId: "", subEventId: "", groupId: "" };
  }
  selectedChatOwnerParts(chat = this.session()?.item ?? null) {
    return this.chatOwnerParts(chat);
  }
  splitChatOwnerId(ownerId) {
    return `${ownerId ?? ""}`.split(":").map((part) => part.trim()).filter(Boolean);
  }
  resolveSelectedChatEventRecord(chat) {
    const eventId = this.chatOwnerParts(chat).eventId;
    if (!eventId) {
      return null;
    }
    if (this.resolvedChatEventRecordKey === eventId) {
      return this.resolvedChatEventRecord;
    }
    return this.eventsService.peekKnownRecordById(this.activeUserId(), eventId);
  }
  resolveSelectedChatSubEvent(chat, eventRecord) {
    const subEventId = this.chatOwnerParts(chat).subEventId;
    if (!subEventId) {
      return null;
    }
    return eventRecord?.subEvents?.find((subEvent) => subEvent.id === subEventId) ?? (chat.navigationContext?.subEvent?.id === subEventId ? chat.navigationContext.subEvent : null);
  }
  resolveSelectedChatGroup(chat, subEvent, eventId) {
    const groupId = this.chatOwnerParts(chat).groupId;
    if (!groupId || !subEvent) {
      return null;
    }
    const groupKey = this.selectedChatGroupSnapshotKey(eventId, subEvent.id, groupId);
    const snapshot = groupKey && this.resolvedChatGroupSnapshotKey === groupKey ? this.resolvedChatGroupSnapshot : null;
    const contextGroup = chat.navigationContext?.group?.id === groupId ? chat.navigationContext.group : null;
    return {
      id: groupId,
      label: `${snapshot?.name ?? contextGroup?.name ?? groupId}`.trim() || groupId,
      source: snapshot?.source ?? contextGroup?.source ?? null,
      accepted: snapshot ? this.chatCountValue(snapshot.membersAccepted) : contextGroup ? this.chatCountValue(contextGroup.accepted) : void 0,
      pending: snapshot ? this.chatCountValue(snapshot.membersPending) : contextGroup ? this.chatCountValue(contextGroup.pending) : void 0,
      capacityMin: snapshot ? this.chatCountValue(snapshot.capacityMin) : contextGroup ? this.chatCountValue(contextGroup.capacityMin) : void 0,
      capacityMax: snapshot ? this.chatCountValue(snapshot.capacityMax) : contextGroup ? this.chatCountValue(contextGroup.capacityMax) : void 0
    };
  }
  selectedChatGroupDisplayLabel(chat, state) {
    const groupId = `${state?.group?.id ?? this.chatOwnerParts(chat).groupId}`.trim();
    const configured = `${state?.group?.label ?? ""}`.trim();
    if (configured && !this.isOwnerIdLikeGroupLabel(configured, groupId)) {
      return configured;
    }
    const titleLabel = this.groupLabelFromChatTitle(chat.title, state?.subEvent?.name);
    if (titleLabel) {
      return titleLabel;
    }
    return this.generatedGroupLabelFromId(groupId) || configured || "Group";
  }
  selectedChatParentDisplayLabel(chat, state) {
    if (state?.channelType !== "groupSubEvent") {
      return "";
    }
    const navigation = chat.navigationContext ?? null;
    const eventTitle = `${state.eventTitle ?? navigation?.eventTitle ?? ""}`.trim();
    const subEvent = state.subEvent ?? navigation?.subEvent ?? null;
    const subEventName = `${subEvent?.name ?? ""}`.trim();
    const timeframe = AppUtils.dateTimeRangeLabel(subEvent?.startAt, subEvent?.endAt, "");
    const parts = [eventTitle, subEventName, timeframe].filter(Boolean);
    return parts.filter((part, index) => parts.findIndex((candidate) => candidate.toLocaleLowerCase("en-US") === part.toLocaleLowerCase("en-US")) === index).join(" \xB7 ");
  }
  groupLabelFromChatTitle(title, subEventName) {
    const normalizedTitle = `${title ?? ""}`.trim();
    if (!normalizedTitle) {
      return "";
    }
    const normalizedSubEventName = `${subEventName ?? ""}`.trim().toLocaleLowerCase("en-US");
    const parts = normalizedTitle.split(/\s+[·-]\s+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
      return parts.find((part) => part.toLocaleLowerCase("en-US") !== normalizedSubEventName) ?? parts[0] ?? "";
    }
    return normalizedSubEventName && normalizedTitle.toLocaleLowerCase("en-US") === normalizedSubEventName ? "" : normalizedTitle;
  }
  isOwnerIdLikeGroupLabel(label, groupId) {
    const normalizedLabel = label.trim();
    const normalizedGroupId = groupId.trim();
    return Boolean(normalizedLabel && (normalizedLabel === normalizedGroupId || normalizedLabel.includes(":") || /^[a-z0-9]+(?:[-_][a-z0-9]+){2,}$/i.test(normalizedLabel)));
  }
  generatedGroupLabelFromId(groupId) {
    const match = groupId.trim().match(/(?:^|[-_:])group[-_:]?(\d+)$/i);
    const index = match ? Math.max(1, Math.trunc(Number(match[1]) || 0)) : 0;
    if (!index) {
      return "";
    }
    return `Group ${this.groupIndexLetters(index)}`;
  }
  groupIndexLetters(index) {
    let value = Math.max(1, Math.trunc(index));
    let label = "";
    while (value > 0) {
      value -= 1;
      label = String.fromCharCode(65 + value % 26) + label;
      value = Math.floor(value / 26);
    }
    return label;
  }
  selectedChatGroupSnapshotKey(eventId, subEventId, groupId) {
    const normalizedEventId = `${eventId ?? ""}`.trim();
    const normalizedSubEventId = `${subEventId ?? ""}`.trim();
    const normalizedGroupId = `${groupId ?? ""}`.trim();
    return normalizedEventId && normalizedSubEventId && normalizedGroupId ? `${normalizedEventId}:${normalizedSubEventId}:${normalizedGroupId}` : "";
  }
  resolveSelectedChatResourceState(ownerId, subEventId) {
    const resourceKey = `${ownerId}:${subEventId}`;
    if (this.resolvedChatResourceStateKey === resourceKey) {
      return ActivityResourceBuilder.cloneState(this.resolvedChatResourceState);
    }
    return ActivityResourceBuilder.cloneState(this.activityResourcesService.peekSubEventResourceState(ownerId, subEventId));
  }
  syncSubEventResourceCounts(subEvent, state, assetCards) {
    for (const type of ASSET_TYPES) {
      const accepted = ActivityResourceBuilder.resourceAcceptedCount(subEvent, type, state, assetCards);
      const pending = ActivityResourceBuilder.resourcePendingCount(subEvent, type, state, assetCards);
      const bounds = ActivityResourceBuilder.resourceCapacityBounds(subEvent, type, state, assetCards, accepted, pending);
      if (type === ASSET_TYPE_TRANSPORT) {
        subEvent.carsAccepted = accepted;
        subEvent.carsPending = pending;
        subEvent.carsCapacityMin = bounds.capacityMin;
        subEvent.carsCapacityMax = bounds.capacityMax;
      } else if (type === ASSET_TYPE_ACCOMMODATION) {
        subEvent.accommodationAccepted = accepted;
        subEvent.accommodationPending = pending;
        subEvent.accommodationCapacityMin = bounds.capacityMin;
        subEvent.accommodationCapacityMax = bounds.capacityMax;
      } else {
        subEvent.suppliesAccepted = accepted;
        subEvent.suppliesPending = pending;
        subEvent.suppliesCapacityMin = bounds.capacityMin;
        subEvent.suppliesCapacityMax = bounds.capacityMax;
      }
    }
    return subEvent;
  }
  applySelectedChatMetricBucketPatch(patch) {
    const session = this.session();
    const state = this.selectedChatNavigationState;
    if (!session || !state || this.chatMetricIdentity(session.item) !== patch.identity) {
      return;
    }
    const nextMetrics = this.chatMetricsWithBucket(state.metrics, patch);
    this.resolvedChatResourceState = null;
    this.patchCurrentEventChatHeader((header) => {
      const headerChat = this.chatFromHeader(header);
      if (this.chatMetricIdentity(headerChat) !== patch.identity) {
        return header;
      }
      return __spreadProps(__spreadValues({}, header), {
        metrics: nextMetrics
      });
    });
    this.selectedChatNavigationState = __spreadProps(__spreadValues({}, state), {
      metrics: nextMetrics,
      subEvent: state.subEvent ? this.applyChatMetricsToSubEvent(state.subEvent, nextMetrics) : state.subEvent,
      group: this.applyChatMetricsToGroup(state.group, nextMetrics)
    });
    this.chatHeaderContext = this.buildSelectedChatHeaderContext(session.item, this.selectedChatNavigationState);
    this.cdr.markForCheck();
  }
  chatMetricIdentity(chat) {
    return ActivityChatSingleRowConverter.smartListKeyForIdentity(this.chatChannelType(chat), chat.ownerId, chat.id);
  }
  chatMetricsWithBucket(metrics, patch) {
    const next = this.cloneChatMetrics(metrics) ?? {
      members: null,
      transport: null,
      accommodation: null,
      supplies: null,
      groupsCount: null,
      pendingTotal: 0
    };
    next[patch.bucketType] = __spreadValues({}, patch.bucket);
    next.pendingTotal = this.chatMetricPendingTotal(next);
    return next;
  }
  cloneChatMetrics(metrics) {
    if (!metrics) {
      return metrics;
    }
    return {
      members: metrics.members ? __spreadValues({}, metrics.members) : null,
      transport: metrics.transport ? __spreadValues({}, metrics.transport) : null,
      accommodation: metrics.accommodation ? __spreadValues({}, metrics.accommodation) : null,
      supplies: metrics.supplies ? __spreadValues({}, metrics.supplies) : null,
      groupsCount: metrics.groupsCount ?? null,
      pendingTotal: this.chatMetricCount(metrics.pendingTotal)
    };
  }
  chatMetricPendingTotal(metrics) {
    return this.chatMetricCount(metrics.members?.pending) + this.chatMetricCount(metrics.transport?.pending) + this.chatMetricCount(metrics.accommodation?.pending) + this.chatMetricCount(metrics.supplies?.pending);
  }
  cloneSubEvent(subEvent) {
    return __spreadValues({}, subEvent);
  }
  flattenAssetCards(assetCardsByType) {
    return ASSET_TYPES.flatMap((type) => assetCardsByType[type] ?? []);
  }
  selectedChatActionToneClass() {
    const channelType = this.selectedChatNavigationState?.channelType;
    if (channelType === "groupSubEvent") {
      return "group";
    }
    if (channelType === "optionalSubEvent") {
      return "optional";
    }
    return "main-event";
  }
  selectedChatHeaderActionPalette() {
    const tone = this.selectedChatActionToneClass();
    if (tone === "group") {
      return "green";
    }
    if (tone === "optional") {
      return "violet";
    }
    return "blue";
  }
  chatContextControlMenuItem(control) {
    const resourceType = this.popupControlResourceType(control);
    const counter = this.selectedChatMenuControlBadgeCount(control);
    return {
      id: `chat-context-${control.id}`,
      label: control.label,
      description: control.summary || void 0,
      icon: this.selectedChatMenuControlIcon(control),
      kind: "action",
      layout: control.summary ? "pill" : "default",
      palette: resourceType ? this.resourceTypePalette(resourceType) : "default",
      surface: resourceType ? "tinted" : "plain",
      counter: counter > 0 ? counter : null,
      context: { menu: "chat-context", control }
    };
  }
  selectedChatActionBadgeCount(chat, state) {
    if (state?.subEvent && (state.channelType === "optionalSubEvent" || state.channelType === "groupSubEvent")) {
      return this.subEventPendingTotal(state.subEvent);
    }
    if (chat.metrics) {
      return this.chatMetricCount(chat.metrics.pendingTotal);
    }
    const eventPending = Math.max(0, Math.trunc(Number(state?.eventPendingMembers) || 0));
    const eventRecord = this.resolveSelectedChatEventRecord(chat);
    const subEventPending = eventRecord?.subEvents?.reduce((sum, subEvent) => {
      const cloned = this.cloneSubEvent(subEvent);
      const resourceState = this.resolveSelectedChatResourceState(eventRecord.id, cloned.id);
      const cards = this.flattenAssetCards(ActivityResourceBuilder.cloneFallbackAssetCardsByType(resourceState?.fallbackAssetCardsByType));
      return sum + this.subEventPendingTotal(this.syncSubEventResourceCounts(cloned, resourceState, cards));
    }, 0) ?? 0;
    return eventPending + subEventPending;
  }
  subEventPendingTotal(subEvent) {
    return this.chatCountValue(subEvent.membersPending) + this.chatCountValue(subEvent.carsPending) + this.chatCountValue(subEvent.accommodationPending) + this.chatCountValue(subEvent.suppliesPending);
  }
  chatCountValue(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  chatMetricCount(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  chatMetricsBucket(metrics, type) {
    if (!metrics) {
      return null;
    }
    if (type === "Members") {
      return metrics.members ?? null;
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return metrics.transport ?? null;
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return metrics.accommodation ?? null;
    }
    return metrics.supplies ?? null;
  }
  chatMetricsBucketSummary(bucket) {
    const accepted = this.chatCountValue(bucket.accepted);
    const pending = this.chatCountValue(bucket.pending);
    const min = this.chatCountValue(bucket.capacityMin);
    const max = Math.max(min, this.chatCountValue(bucket.capacityMax), accepted + pending);
    return `${accepted} / ${min} - ${max}`;
  }
  resourceSummary(subEvent, state, type) {
    if (type === "Members") {
      const accepted2 = this.chatCountValue(subEvent.membersAccepted);
      const min = this.chatCountValue(subEvent.capacityMin);
      const max = Math.max(min, this.chatCountValue(subEvent.capacityMax), accepted2);
      return `${accepted2} / ${min} - ${max}`;
    }
    const accepted = this.resourceAcceptedCount(subEvent, state, type);
    const pending = this.resourcePendingCount(subEvent, state, type);
    const bounds = ActivityResourceBuilder.resourceCapacityBounds(subEvent, type, this.resolveSelectedChatResourceState(`${state.eventId ?? ""}`, subEvent.id), this.flattenAssetCards(state.assetCardsByType), accepted, pending);
    return `${accepted} / ${bounds.capacityMin} - ${bounds.capacityMax}`;
  }
  resourceAcceptedCount(subEvent, state, type) {
    return ActivityResourceBuilder.resourceAcceptedCount(subEvent, type, this.resolveSelectedChatResourceState(`${state.eventId ?? ""}`, subEvent.id), this.flattenAssetCards(state.assetCardsByType));
  }
  resourcePendingCount(subEvent, state, type) {
    if (type === "Members") {
      return this.chatCountValue(subEvent.membersPending);
    }
    return ActivityResourceBuilder.resourcePendingCount(subEvent, type, this.resolveSelectedChatResourceState(`${state.eventId ?? ""}`, subEvent.id), this.flattenAssetCards(state.assetCardsByType));
  }
  popupControlResourceType(control) {
    if (control.lookup?.type !== "chatResource") {
      return null;
    }
    const id = `${control.lookup.id ?? ""}`.trim();
    return id === "Members" || isAssetType(id) ? id : null;
  }
  resourceTypePalette(type) {
    if (type === "Members") {
      return "violet";
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return "blue";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "green";
    }
    return "brown";
  }
  resourceTypeIcon(type) {
    if (type === "Members") {
      return "groups";
    }
    if (type === ASSET_TYPE_TRANSPORT) {
      return "directions_car";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "apartment";
    }
    return "inventory_2";
  }
  resourceTypeLabel(type) {
    return type === "Members" ? "Members" : AssetDefaultsBuilder.assetTypeLabel(type);
  }
  firstAvailableAssetType() {
    const state = this.selectedChatNavigationState;
    if (!state) {
      return null;
    }
    return ASSET_TYPES.find((type) => (state.assetCardsByType[type]?.length ?? 0) > 0) ?? null;
  }
  shouldOpenMessageToolsDown(event) {
    const target = this.messagePlacementTarget(event);
    const scrollElement = this.chatThreadSmartList?.scrollElement();
    if (!target || !scrollElement) {
      return false;
    }
    const targetRect = target.getBoundingClientRect();
    const scrollRect = scrollElement.getBoundingClientRect();
    return targetRect.top - scrollRect.top < 44;
  }
  shouldOpenQuickReactionsDown(event) {
    const target = this.messagePlacementTarget(event);
    const scrollElement = this.chatThreadSmartList?.scrollElement();
    if (!target || !scrollElement) {
      return false;
    }
    const targetRect = target.getBoundingClientRect();
    const scrollRect = scrollElement.getBoundingClientRect();
    return targetRect.top - scrollRect.top < 92;
  }
  messagePlacementTarget(event) {
    const rawTarget = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event?.target instanceof HTMLElement ? event.target : null;
    if (!rawTarget) {
      return null;
    }
    return rawTarget.closest(".chat-bubble") ?? rawTarget.closest(".chat-message") ?? rawTarget;
  }
  isChatThreadNearEnd() {
    const scrollElement = this.chatThreadSmartList?.scrollElement();
    if (!scrollElement) {
      return true;
    }
    return Math.abs(scrollElement.scrollTop) <= 72;
  }
  scheduleChatThreadScrollToEnd() {
    const run = () => {
      const scrollElement = this.chatThreadSmartList?.scrollElement();
      if (!scrollElement) {
        return;
      }
      scrollElement.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  scheduleChatThreadScrollToMessage(messageId) {
    const normalizedMessageId = `${messageId ?? ""}`.trim();
    if (!normalizedMessageId) {
      return;
    }
    const run = () => {
      const scrollElement = this.chatThreadSmartList?.scrollElement();
      const target = scrollElement?.querySelector(`[data-chat-message-id="${CSS.escape(normalizedMessageId)}"]`);
      if (!target) {
        return;
      }
      target.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "smooth"
      });
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(run));
      return;
    }
    setTimeout(run, 0);
  }
  ensureChatThreadMessageVisible(messageId) {
    const normalizedMessageId = `${messageId ?? ""}`.trim();
    if (!normalizedMessageId) {
      return false;
    }
    const targetIndex = this.messages.findIndex((message) => `${message.id ?? ""}`.trim() === normalizedMessageId);
    if (targetIndex < 0) {
      return false;
    }
    const smartList = this.chatThreadSmartList;
    const visibleCount = smartList?.itemsSnapshot().length ?? 0;
    if (!smartList || targetIndex < visibleCount) {
      return true;
    }
    smartList.replaceVisibleItems(this.messages.slice(0, targetIndex + 1), { total: this.chatThreadVisibleTotal() });
    return true;
  }
  replyReferenceText(message) {
    if (message.text?.trim()) {
      return message.text.trim();
    }
    const firstAttachment = message.attachments?.[0];
    if (firstAttachment?.type === "image") {
      return "Image";
    }
    if (firstAttachment?.type === "event") {
      return this.attachmentReferenceLabel(firstAttachment, "Event");
    }
    if (firstAttachment?.type === "asset") {
      return this.attachmentReferenceLabel(firstAttachment, "Asset");
    }
    return this.chatAttachmentSummary(message) || "Message";
  }
  attachmentReferenceLabel(attachment, fallbackType) {
    const parts = this.attachmentReferenceParts(attachment, fallbackType);
    return [parts.title, parts.meta].filter(Boolean).join(" \xB7 ") || fallbackType;
  }
  attachmentReferenceParts(attachment, fallbackType) {
    const title = `${attachment.title ?? ""}`.trim();
    const subtitle = `${attachment.subtitle ?? ""}`.trim();
    const typeLabel = attachment.type === "event" ? "Event" : attachment.type === "asset" ? "Asset" : fallbackType;
    return {
      title: [typeLabel, title].filter(Boolean).join(" \xB7 ") || typeLabel,
      meta: subtitle
    };
  }
  capitalize(value) {
    const normalized = `${value ?? ""}`.trim();
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "";
  }
  observeChatComposeBox() {
    this.clearChatComposeResizeObserver();
    this.syncChatComposeDetachedSpace();
    const composeElement = this.chatComposeBoxRef?.nativeElement;
    if (!composeElement || typeof ResizeObserver === "undefined") {
      return;
    }
    this.chatComposeResizeObserver = new ResizeObserver(() => {
      this.syncChatComposeDetachedSpace();
    });
    this.chatComposeResizeObserver.observe(composeElement);
  }
  clearChatComposeResizeObserver() {
    this.chatComposeResizeObserver?.disconnect();
    this.chatComposeResizeObserver = null;
  }
  syncChatComposeDetachedSpace() {
    const composeElement = this.chatComposeBoxRef?.nativeElement;
    const measuredHeight = composeElement?.getBoundingClientRect().height ?? 0;
    const nextSpace = Math.max(72, Math.ceil(measuredHeight + 16));
    if (nextSpace === this.chatComposeDetachedSpace) {
      return;
    }
    this.chatComposeDetachedSpace = nextSpace;
    this.cdr.markForCheck();
  }
  static \u0275fac = function EventChatPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventChatPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventChatPopupComponent, selectors: [["app-event-chat-popup"]], viewQuery: function EventChatPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5)(_c2, 5)(_c3, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chatThreadSmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.messageTextarea = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.imageAttachmentInput = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chatComposeBoxElement = _t.first);
    }
  }, inputs: { chatSession: "chatSession", chatHeader: "chatHeader", closeHostedChat: "closeHostedChat" }, decls: 11, vars: 9, consts: [["chatThreadMessageTemplate", ""], ["chatThreadSmartList", ""], ["chatComposeBox", ""], ["imageAttachmentInput", ""], ["messageTextarea", ""], [1, "event-chat-popup-shell", 3, "--chat-shell-z-index", "--chat-compose-detached-space", "model", "zIndex"], [3, "model", "zIndex"], [1, "event-chat-popup-shell", 3, "model", "zIndex"], [1, "chat-popup-wrap"], [1, "chat-popup-box"], [3, "menuItemSelect", "config", "loadPage", "itemTemplate", "query"], [1, "chat-typing-indicator"], [1, "chat-compose-box"], [1, "chat-reply-draft"], [1, "chat-reply-draft", "chat-edit-draft"], [1, "chat-compose-plus-wrap"], ["kind", "select", "panelAlign", "start", 1, "chat-composer-app-menu", 3, "itemSelect", "trigger", "items", "openUp"], ["type", "file", "accept", "image/*", 1, "chat-attachment-input", 3, "change"], [1, "chat-voice-composer"], [1, "chat-typing-indicator-users"], ["aria-hidden", "true", 1, "chat-typing-indicator-dots"], [1, "chat-reply-draft-copy"], ["type", "button", "aria-label", "Cancel reply", 3, "click"], ["type", "button", "aria-label", "Cancel edit", 3, "click"], [1, "chat-voice-composer", 3, "click"], ["type", "button", "aria-label", "Cancel voice clip", 1, "chat-voice-cancel-btn", 3, "click", "disabled"], ["controls", "", "controlsList", "nodownload noplaybackrate", "preload", "metadata", 1, "chat-voice-review-player", 3, "src"], [1, "chat-voice-recorder-shell", 3, "is-recording"], [1, "chat-voice-timer"], ["type", "button", "aria-label", "Send voice clip", 1, "chat-voice-send-btn", 3, "click", "disabled"], [1, "chat-voice-error"], [1, "chat-voice-recorder-shell"], ["type", "button", 1, "chat-voice-record-btn", 3, "click", "disabled"], [1, "chat-voice-bars"], ["rows", "1", "placeholder", "Write message", 3, "ngModelChange", "input", "keydown", "ngModel", "disabled"], ["type", "button", "aria-label", "Send message", 1, "chat-send-btn", 3, "click", "disabled"], ["role", "listbox", "aria-label", "Emoji suggestions", 1, "chat-ascii-emoji-panel"], ["type", "button", "role", "option"], ["type", "button", "role", "option", 3, "mousedown", "click"], [1, "chat-ascii-emoji-panel__emoji"], [1, "chat-ascii-emoji-panel__token"], [1, "chat-poll-composer"], [1, "chat-poll-composer-header"], ["type", "text", "placeholder", "Ask a question", 3, "ngModelChange", "ngModel", "disabled"], [1, "chat-poll-composer-options"], [1, "chat-poll-composer-option"], [1, "chat-poll-composer-actions"], ["type", "button", 1, "chat-poll-add-option-btn", 3, "click", "disabled"], ["type", "button", 1, "chat-poll-create-btn", 3, "click", "disabled"], ["type", "text", 3, "ngModelChange", "placeholder", "ngModel", "disabled"], ["type", "button", 3, "click"], [1, "chat-message", 3, "click", "touchstart", "touchend", "touchcancel"], ["type", "button", "aria-label", "Open replied message", 1, "chat-message-reply-context"], [1, "chat-bubble"], [1, "chat-sender-avatar", 3, "class"], [1, "chat-message-content"], [1, "chat-meta-row"], [1, "chat-line", "chat-line-deleted"], ["aria-label", "Pinned message", 1, "chat-pin-badge"], ["type", "button", 1, "chat-reaction-summary"], [1, "chat-message-tools", 3, "chat-message-tools-down"], [1, "chat-quick-reactions", 3, "chat-quick-reactions-down", "chat-quick-reactions-tools-down"], ["type", "button", "aria-label", "Open replied message", 1, "chat-message-reply-context", 3, "click", "contextmenu"], [1, "chat-message-reply-label"], [1, "chat-message-reply-quote", 3, "chat-message-reply-quote--structured"], [1, "chat-message-reply-quote"], [1, "chat-message-reply-title"], [1, "chat-message-reply-meta"], [1, "chat-sender-avatar"], ["loading", "lazy", "decoding", "async", 3, "src", "alt"], [1, "chat-sender-name"], [1, "chat-time-chip"], [1, "chat-attachment-stack"], [1, "chat-line"], [1, "chat-edited-label"], [1, "chat-image-attachment"], [1, "chat-voice-attachment"], [1, "chat-card-attachment", 3, "chat-card-attachment-event", "chat-card-attachment-asset", "chat-card-attachment-link", "chat-card-attachment-unavailable"], [1, "chat-voice-attachment-icon"], [1, "chat-voice-attachment-copy"], [1, "chat-voice-attachment-player"], [1, "chat-voice-attachment-missing"], ["controls", "", "controlsList", "nodownload noplaybackrate", "preload", "metadata", 3, "src"], [1, "chat-poll-attachment"], [1, "chat-poll-options"], [1, "chat-poll-option"], ["type", "button", 1, "chat-poll-vote-btn", 3, "click"], [1, "chat-poll-option-row"], [1, "chat-poll-option-text"], [1, "chat-poll-voters"], [1, "chat-poll-voter-avatar", 3, "class"], [1, "chat-poll-bar"], [1, "chat-poll-voter-avatar"], [1, "chat-card-attachment"], [1, "chat-card-attachment-media"], [1, "chat-card-attachment-copy"], [1, "chat-card-attachment-kicker"], [1, "chat-card-attachment-status"], [1, "chat-card-attachment-description"], ["type", "button", 1, "chat-line-link"], ["type", "button", 1, "chat-line-link", 3, "click"], ["type", "button", 1, "chat-reaction-summary", 3, "click"], [1, "chat-message-tools", 3, "click"], ["type", "button", "aria-label", "Reply", 3, "click"], ["type", "button", "aria-label", "React", 3, "click"], ["kind", "select", "panelAlign", "auto", 1, "chat-message-action-trigger", 3, "menuId", "trigger", "items"], [1, "chat-quick-reactions", 3, "click"], ["type", "button"], ["menuId", "chat-mobile-emoji-picker", "kind", "select", "title", "Search emoji", "panelMode", "sheet", 1, "chat-emoji-menu", 3, "trigger", "model", "filterable", "closeOnSelect"], ["kind", "select", "title", "Search emoji", "panelAlign", "auto", 1, "chat-emoji-menu", 3, "trigger", "model", "filterable", "closeOnSelect"], ["kind", "select", "title", "Search emoji", "panelAlign", "auto", 1, "chat-emoji-menu", 3, "itemSelect", "trigger", "model", "filterable", "closeOnSelect"], [1, "chat-readers"], [1, "chat-reader", 3, "class", "chat-reader-fresh"], [1, "chat-reader"], [1, "chat-reaction-tabs"], ["type", "button", 3, "active"], [1, "chat-reaction-list"], [1, "chat-reaction-row"], [1, "chat-reaction-avatar"], [1, "chat-reaction-row-emoji"], [1, "chat-poll-vote-body"], [1, "chat-poll-vote-options"], ["type", "button", 1, "chat-poll-vote-option", 3, "is-selected"], [1, "chat-poll-vote-actions"], ["kind", "inline", "layout", "row", 3, "itemSelect", "items"], ["type", "button", 1, "chat-poll-vote-option", 3, "click"], [1, "chat-poll-check"], [1, "chat-pinned-list"], ["type", "button", 1, "chat-pinned-message"], ["type", "button", 1, "chat-pinned-message", 3, "click"], [1, "chat-pinned-message-content"], ["aria-label", "Pinned message", 1, "chat-pin-badge", "chat-pinned-dialog-pin"], [1, "chat-reaction-summary", "chat-pinned-reaction-summary"], [1, "chat-readers", "chat-pinned-readers"], [1, "chat-pinned-attachment"], [1, "chat-pinned-image-preview"], [1, "chat-reader", 3, "class"], [4, "ngComponentOutlet"], [4, "ngComponentOutlet", "ngComponentOutletInputs"]], template: function EventChatPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventChatPopupComponent_Conditional_0_Template, 16, 18, "app-popup", 5);
      \u0275\u0275conditionalCreate(1, EventChatPopupComponent_Conditional_1_Template, 14, 6, "app-popup", 6);
      \u0275\u0275template(2, EventChatPopupComponent_ng_template_2_Template, 13, 26, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275conditionalCreate(4, EventChatPopupComponent_Conditional_4_Template, 9, 5, "app-popup", 6);
      \u0275\u0275conditionalCreate(5, EventChatPopupComponent_Conditional_5_Template, 9, 4, "app-popup", 6);
      \u0275\u0275conditionalCreate(6, EventChatPopupComponent_Conditional_6_Template, 5, 3, "app-popup", 6);
      \u0275\u0275conditionalCreate(7, EventChatPopupComponent_Conditional_7_Template, 1, 1);
      \u0275\u0275conditionalCreate(8, EventChatPopupComponent_Conditional_8_Template, 1, 1);
      \u0275\u0275conditionalCreate(9, EventChatPopupComponent_Conditional_9_Template, 1, 1);
      \u0275\u0275conditionalCreate(10, EventChatPopupComponent_Conditional_10_Template, 1, 1);
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_6_0;
      \u0275\u0275conditional((tmp_1_0 = ctx.session()) ? 0 : -1, tmp_1_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pollComposerOpen ? 1 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_3_0 = ctx.reactionDetailsMessage()) ? 4 : -1, tmp_3_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_4_0 = ctx.pollVoteDialogContext()) ? 5 : -1, tmp_4_0);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.pinnedDialogOpen ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_6_0 = ctx.eventSubeventsStore.eventSubeventsListPopup()) == null ? null : tmp_6_0.host) === "chat" ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostChatResourcePopup() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostChatResourcePopup() && ctx.resourcePopupStore.assetExplorePopupRef() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.shouldHostChatSupplyContributionsPopup() ? 10 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgComponentOutlet,
    FormsModule,
    DefaultValueAccessor,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    PopupComponent,
    AppMenuComponent,
    AppMenuTriggerComponent,
    SmartListComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  --text-main: #22324a;\n  --line: rgba(23, 33, 54, 0.12);\n  --chat-compose-detached-space: 108px;\n  --chat-pending-progress-duration: 3s;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n@property --chat-progress-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }\n.chat-popup-wrap[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  height: 100%;\n  min-height: 0;\n}\n.chat-popup-box[_ngcontent-%COMP%] {\n  border: 1px solid var(--line);\n  border-radius: 12px;\n  padding: 0.6rem;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  gap: 0.45rem;\n  overflow: visible;\n  min-height: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fcff 0%,\n      #f3f8ff 100%);\n}\n.chat-popup-box[_ngcontent-%COMP%]    > app-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  overflow: hidden;\n}\n.editor-list-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(56, 91, 138, 0.22);\n  border-radius: 12px;\n  padding: 0.9rem;\n  background: #fff;\n  color: rgba(23, 40, 63, 0.8);\n}\n.editor-list-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.chat-thread[_ngcontent-%COMP%] {\n  max-height: none;\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: block;\n  padding: 0 0.12rem 1.1rem 0;\n}\n[_nghost-%COMP%]     .smart-list--list.chat-thread-list {\n  padding: 0 0.12rem 1.45rem 0;\n}\n.chat-day-sticky[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  justify-content: center;\n  margin: 0.08rem 0 0.3rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(245, 249, 255, 0.98) 0%,\n      rgba(245, 249, 255, 0.86) 70%,\n      rgba(245, 249, 255, 0) 100%);\n}\n.chat-day-pill[_ngcontent-%COMP%] {\n  border: 1px solid rgba(43, 74, 116, 0.2);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.94);\n  color: rgba(36, 64, 99, 0.88);\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.22rem 0.58rem;\n}\n.chat-message[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  width: 100%;\n  margin-bottom: 0.8rem;\n  position: relative;\n  z-index: 1;\n}\n.chat-message[_ngcontent-%COMP%]:has(.chat-readers) {\n  margin-bottom: 1.15rem;\n}\n.chat-message.mine[_ngcontent-%COMP%] {\n  align-items: flex-end;\n}\n.chat-bubble[_ngcontent-%COMP%] {\n  position: relative;\n  width: fit-content;\n  max-width: min(420px, 84%);\n  border: 1px solid rgba(16, 29, 49, 0.14);\n  border-radius: 11px;\n  background: #fff3f3;\n  padding: 0.44rem 0.56rem 0.48rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.48rem;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  cursor: pointer;\n}\n.chat-message-content[_ngcontent-%COMP%], \n.chat-line[_ngcontent-%COMP%] {\n  cursor: inherit;\n}\n.chat-message-content[_ngcontent-%COMP%] {\n  flex: 0 1 auto;\n  max-width: min(360px, 100vw - 8rem);\n  min-width: 0;\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  background: #e9f2ff;\n  border-color: rgba(55, 97, 154, 0.32);\n}\n.chat-bubble[_ngcontent-%COMP%]:has(.chat-voice-attachment) {\n  padding-right: 0.9rem;\n}\n.chat-bubble[_ngcontent-%COMP%]:has(.chat-image-attachment) {\n  max-width: fit-content;\n}\n.chat-bubble[_ngcontent-%COMP%]:has(.chat-image-attachment)   .chat-message-content[_ngcontent-%COMP%] {\n  width: auto;\n  max-width: min(360px, 100vw - 7rem);\n  flex: 0 0 auto;\n}\n.chat-bubble[_ngcontent-%COMP%]:has(.chat-image-attachment)   .chat-attachment-stack[_ngcontent-%COMP%] {\n  width: auto;\n  justify-items: start;\n}\n.chat-message.chat-message-deleted[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%], \n.chat-message.chat-message-deleted.mine[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  background: rgba(246, 248, 251, 0.92);\n  border-color: rgba(99, 113, 132, 0.22);\n  box-shadow: none;\n  cursor: default;\n}\n.chat-message.chat-message-deleted.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%], \n.chat-message.chat-message-deleted.chat-message-pending.mine[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  background: rgba(255, 238, 238, 0.96);\n  border-color: rgba(202, 72, 82, 0.34);\n}\n.chat-message[_ngcontent-%COMP%]:not(.mine)   .chat-bubble[_ngcontent-%COMP%] {\n  border-color: rgba(176, 87, 87, 0.28);\n}\n.chat-message.chat-message-deleted[_ngcontent-%COMP%]:not(.mine)   .chat-bubble[_ngcontent-%COMP%] {\n  border-color: rgba(99, 113, 132, 0.22);\n}\n.chat-sender-avatar[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  overflow: hidden;\n}\n.chat-sender-avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.user-color-deleted[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #a7adb7,\n      #687180);\n}\n.user-color-system[_ngcontent-%COMP%] {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.chat-sender-avatar.user-color-system[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n  line-height: 19px;\n}\n.chat-message-content[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.chat-meta-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  margin-bottom: 0.2rem;\n}\n.chat-sender-name[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  font-weight: 800;\n  color: rgba(20, 32, 52, 0.92);\n  line-height: 1.2;\n}\n.chat-time-chip[_ngcontent-%COMP%] {\n  margin-left: auto;\n  min-width: 56px;\n  height: 18px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.08);\n  color: rgba(20, 32, 52, 0.58);\n  font-size: 0.66rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 7px;\n}\n.chat-line[_ngcontent-%COMP%] {\n  margin: 0;\n  max-width: min(340px, 100vw - 8rem);\n  color: rgba(16, 29, 49, 0.88);\n  font-size: 0.82rem;\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n.chat-line-link[_ngcontent-%COMP%] {\n  display: inline;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #0b64c0;\n  font: inherit;\n  text-decoration: underline;\n  overflow-wrap: anywhere;\n  cursor: pointer;\n}\n.chat-attachment-stack[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  margin: 0.1rem 0 0.36rem;\n  width: 100%;\n}\n.chat-image-attachment[_ngcontent-%COMP%] {\n  margin: 0;\n  display: grid;\n  gap: 0.2rem;\n  width: auto;\n  max-width: min(360px, 100%);\n}\n.chat-image-attachment[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: auto;\n  max-width: 100%;\n  max-height: clamp(180px, 38vw, 260px);\n  height: auto;\n  object-fit: contain;\n  border-radius: 10px;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  background: rgba(255, 255, 255, 0.7);\n  content-visibility: auto;\n  contain-intrinsic-size: 320px 210px;\n}\n.chat-image-attachment[_ngcontent-%COMP%]   figcaption[_ngcontent-%COMP%] {\n  display: none;\n  max-width: 100%;\n  color: rgba(34, 50, 74, 0.6);\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-voice-attachment[_ngcontent-%COMP%] {\n  width: min(320px, 100%);\n  min-width: 240px;\n  max-width: 100%;\n  display: grid;\n  grid-template-columns: 34px minmax(0, 1fr);\n  gap: 0.46rem 0.62rem;\n  align-items: center;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.86);\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n  overflow: hidden;\n}\n.chat-voice-attachment-icon[_ngcontent-%COMP%] {\n  margin: 0.62rem 0 0 0.62rem;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: #c0139a;\n  color: #fff;\n}\n.chat-voice-attachment-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.chat-voice-attachment-copy[_ngcontent-%COMP%] {\n  margin: 0.62rem 0.62rem 0 0;\n  min-width: 0;\n  display: grid;\n  gap: 0.1rem;\n}\n.chat-voice-attachment-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.chat-voice-attachment-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.chat-voice-attachment-missing[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-voice-attachment-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.84rem;\n}\n.chat-voice-attachment-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.chat-voice-attachment-missing[_ngcontent-%COMP%] {\n  color: rgba(32, 51, 78, 0.68);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.chat-voice-attachment-player[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  min-width: 190px;\n  max-width: 100%;\n  overflow: hidden;\n  border-radius: 0 0 9px 9px;\n}\n.chat-voice-attachment[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 190px;\n  max-width: 100%;\n  height: 34px;\n  border-radius: 0 0 9px 9px;\n  overflow: hidden;\n}\n.chat-poll-attachment[_ngcontent-%COMP%] {\n  width: 200px;\n  display: grid;\n  gap: 0.56rem;\n  padding: 0.54rem 0.54rem 0.68rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n}\n.chat-poll-attachment[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.9rem;\n  line-height: 1.18;\n  text-align: center;\n}\n.chat-poll-options[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.38rem;\n}\n.chat-poll-option[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0;\n  color: #22324a;\n  text-align: left;\n}\n.chat-poll-option-row[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.chat-poll-check[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border: 1px solid rgba(33, 54, 82, 0.45);\n  border-radius: 4px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n}\n.chat-poll-vote-option.is-selected[_ngcontent-%COMP%]   .chat-poll-check[_ngcontent-%COMP%] {\n  border-color: #0b74de;\n  background: #0b74de;\n}\n.chat-poll-check[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.chat-poll-option-text[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.82rem;\n  font-weight: 750;\n}\n.chat-poll-voters[_ngcontent-%COMP%] {\n  min-width: 56px;\n  display: inline-flex;\n  justify-content: flex-end;\n}\n.chat-poll-voter-avatar[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  margin-left: -5px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.52rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.chat-poll-bar[_ngcontent-%COMP%] {\n  height: 7px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.06);\n  overflow: hidden;\n}\n.chat-poll-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: rgba(123, 92, 214, 0.44);\n}\n.chat-poll-vote-btn[_ngcontent-%COMP%] {\n  height: 32px;\n  width: fit-content;\n  justify-self: center;\n  padding: 0 1rem;\n  border: 0;\n  border-radius: 8px;\n  background: rgba(20, 32, 52, 0.06);\n  color: rgba(16, 29, 49, 0.92);\n  font-weight: 850;\n  cursor: pointer;\n}\n.chat-poll-vote-btn[_ngcontent-%COMP%]:not(:disabled) {\n  background: #0b74de;\n  color: #fff;\n}\n.chat-card-attachment[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 112px;\n  display: flex;\n  align-items: stretch;\n  gap: 0.62rem;\n  padding: 0;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #22324a;\n  text-align: left;\n  cursor: inherit;\n  overflow: hidden;\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n  -webkit-tap-highlight-color: transparent;\n}\n.chat-card-attachment-media[_ngcontent-%COMP%] {\n  flex: 0 0 116px;\n  min-height: 112px;\n  background: rgba(229, 236, 246, 0.78);\n}\n.chat-card-attachment-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 112px;\n  object-fit: cover;\n}\n.chat-card-attachment-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n  display: grid;\n  align-content: center;\n  gap: 0.2rem;\n  padding: 0.62rem 0.68rem 0.62rem 0;\n}\n.chat-card-attachment[_ngcontent-%COMP%]:not(:has(.chat-card-attachment-media))   .chat-card-attachment-copy[_ngcontent-%COMP%] {\n  padding-left: 0.68rem;\n}\n.chat-card-attachment-kicker[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  color: rgba(38, 56, 82, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.chat-card-attachment-kicker[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.chat-card-attachment[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.chat-card-attachment[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.chat-card-attachment-description[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.chat-card-attachment[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.84rem;\n  line-height: 1.18;\n  white-space: nowrap;\n}\n.chat-card-attachment[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(32, 51, 78, 0.68);\n  font-size: 0.74rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.chat-card-attachment-description[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  color: rgba(37, 52, 74, 0.72);\n  font-size: 0.74rem;\n  line-height: 1.25;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%] {\n  border-color: rgba(54, 143, 92, 0.22);\n  background: rgba(242, 251, 246, 0.9);\n}\n.chat-card-attachment-event[_ngcontent-%COMP%]   .chat-card-attachment-kicker[_ngcontent-%COMP%] {\n  color: #23643d;\n}\n.chat-card-attachment-asset[_ngcontent-%COMP%] {\n  border-color: rgba(77, 93, 116, 0.2);\n  background: rgba(247, 249, 252, 0.94);\n}\n.chat-card-attachment-asset[_ngcontent-%COMP%]   .chat-card-attachment-kicker[_ngcontent-%COMP%] {\n  color: #35445a;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%], \n.chat-card-attachment-asset[_ngcontent-%COMP%] {\n  width: min(300px, 100%);\n  min-height: 0;\n  display: grid;\n  gap: 0;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%]   .chat-card-attachment-media[_ngcontent-%COMP%], \n.chat-card-attachment-asset[_ngcontent-%COMP%]   .chat-card-attachment-media[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  height: 116px;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%]   .chat-card-attachment-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], \n.chat-card-attachment-asset[_ngcontent-%COMP%]   .chat-card-attachment-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  min-height: 0;\n  height: 100%;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%]   .chat-card-attachment-copy[_ngcontent-%COMP%], \n.chat-card-attachment-asset[_ngcontent-%COMP%]   .chat-card-attachment-copy[_ngcontent-%COMP%] {\n  padding: 0.58rem 0.66rem 0.64rem;\n  align-content: start;\n}\n.chat-card-attachment-event[_ngcontent-%COMP%]:not(:has(.chat-card-attachment-media))   .chat-card-attachment-copy[_ngcontent-%COMP%], \n.chat-card-attachment-asset[_ngcontent-%COMP%]:not(:has(.chat-card-attachment-media))   .chat-card-attachment-copy[_ngcontent-%COMP%] {\n  padding-left: 0.66rem;\n}\n.chat-card-attachment-link[_ngcontent-%COMP%] {\n  width: fit-content;\n  max-width: min(260px, 100%);\n  min-height: 0;\n  border-color: rgba(47, 103, 177, 0.22);\n  background: rgba(241, 247, 255, 0.94);\n}\n.chat-card-attachment-link[_ngcontent-%COMP%]   .chat-card-attachment-copy[_ngcontent-%COMP%] {\n  padding: 0.58rem 0.66rem 0.64rem;\n  align-content: start;\n  flex: 0 0 auto;\n  width: max-content;\n  max-width: 100%;\n}\n.chat-card-attachment-link[_ngcontent-%COMP%]   .chat-card-attachment-kicker[_ngcontent-%COMP%] {\n  color: #245b9f;\n}\n.chat-card-attachment-unavailable[_ngcontent-%COMP%] {\n  border-color: rgba(98, 111, 130, 0.22);\n  background: rgba(244, 247, 250, 0.78);\n  box-shadow: none;\n  filter: grayscale(0.35);\n}\n.chat-card-attachment-unavailable[_ngcontent-%COMP%]   .chat-card-attachment-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  opacity: 0.52;\n}\n.chat-card-attachment-unavailable[_ngcontent-%COMP%]   .chat-card-attachment-kicker[_ngcontent-%COMP%], \n.chat-card-attachment-unavailable[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.chat-card-attachment-unavailable[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.chat-card-attachment-unavailable[_ngcontent-%COMP%]   .chat-card-attachment-description[_ngcontent-%COMP%] {\n  color: rgba(72, 84, 101, 0.72);\n}\n.chat-card-attachment-status[_ngcontent-%COMP%] {\n  color: rgba(73, 85, 103, 0.82);\n}\n.chat-message[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0.8rem;\n}\n.chat-thread-list--reverse[_ngcontent-%COMP%]   .chat-message[_ngcontent-%COMP%]:first-child {\n  margin-bottom: 1.35rem;\n}\n.chat-thread-list--reverse[_ngcontent-%COMP%]   .chat-message[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0.8rem;\n}\n.chat-message.chat-message-selected[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  box-shadow: 0 0 0 2px rgba(66, 110, 182, 0.18), 0 16px 34px rgba(24, 42, 68, 0.12);\n}\n.chat-message.chat-message-selected[_ngcontent-%COMP%] {\n  z-index: 25;\n}\n.chat-message.chat-message-highlighted[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_chat-message-reply-highlight 0.72s ease-out;\n}\n.chat-message-reply-context[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 0;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.16rem;\n  max-width: min(360px, 76%);\n  margin: 0 0 -0.42rem 2.75rem;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: rgba(35, 54, 82, 0.66);\n  font-size: 0.76rem;\n  cursor: pointer;\n  -webkit-user-select: none;\n  user-select: none;\n  touch-action: manipulation;\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-message-reply-context[_ngcontent-%COMP%] {\n  align-items: flex-end;\n  margin-right: 0.62rem;\n  margin-left: 0;\n}\n.chat-message-reply-label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  color: rgba(43, 61, 88, 0.82);\n  font-weight: 700;\n}\n.chat-message-reply-label[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.chat-message-reply-quote[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.14rem;\n  max-width: 100%;\n  min-width: 7.5rem;\n  padding: 0.44rem 0.78rem 0.56rem;\n  border: 1px solid rgba(33, 54, 82, 0.09);\n  border-radius: 16px;\n  background: rgba(238, 241, 245, 0.92);\n  color: rgba(35, 49, 70, 0.78);\n  box-shadow: 0 8px 18px rgba(20, 32, 52, 0.06);\n  font-weight: 650;\n  line-height: 1.25;\n  overflow: hidden;\n  text-align: left;\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-message-reply-quote[_ngcontent-%COMP%] {\n  background: rgba(238, 241, 245, 0.92);\n  margin-right: 0.42rem;\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-message-reply-quote--structured[_ngcontent-%COMP%] {\n  transform: translateX(-4.5rem);\n}\n.chat-message-reply-title[_ngcontent-%COMP%], \n.chat-message-reply-meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.chat-message-reply-title[_ngcontent-%COMP%] {\n  font-weight: 800;\n}\n.chat-message-reply-meta[_ngcontent-%COMP%] {\n  color: rgba(45, 61, 84, 0.58);\n  font-size: 0.72rem;\n  font-weight: 650;\n}\n.chat-bubble[_ngcontent-%COMP%] {\n  z-index: 1;\n}\n.chat-line-deleted[_ngcontent-%COMP%] {\n  color: rgba(79, 92, 112, 0.78);\n  font-style: italic;\n}\n.chat-pin-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.6rem;\n  right: -0.15rem;\n  z-index: 4;\n  width: 18px;\n  height: 18px;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 50%;\n  background: #fff;\n  color: #345c91;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16);\n}\n.chat-pin-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n}\n.chat-edited-label[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.16rem;\n  color: rgba(66, 82, 106, 0.58);\n  font-size: 0.68rem;\n}\n.chat-reaction-summary[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.32rem;\n  bottom: -0.64rem;\n  z-index: 4;\n  display: inline-flex;\n  gap: 0.25rem;\n  padding: 0.12rem 0.34rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 999px;\n  background: #fff;\n  color: #263852;\n  font-size: 0.74rem;\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.14);\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-reaction-summary[_ngcontent-%COMP%] {\n  left: 0.32rem;\n  right: auto;\n}\n.chat-message-tools[_ngcontent-%COMP%], \n.chat-quick-reactions[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 35;\n  background: rgba(255, 255, 255, 0.98);\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  box-shadow: 0 18px 44px rgba(17, 24, 39, 0.16);\n}\n.chat-message-tools[_ngcontent-%COMP%] {\n  top: 0;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  display: inline-flex;\n  gap: 0.1rem;\n  padding: 0.18rem;\n  border-radius: 999px;\n}\n.chat-message-tools.chat-message-tools-down[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: -1.08rem;\n  transform: translateX(-50%);\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-message-tools[_ngcontent-%COMP%] {\n  left: 50%;\n  right: auto;\n}\n.chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.chat-quick-reactions[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  color: #446280;\n}\n.chat-message-tools[_ngcontent-%COMP%]   button.chat-tool-btn-open[_ngcontent-%COMP%] {\n  background: #eef4ff;\n}\n.chat-message-tools[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.chat-quick-reactions[_ngcontent-%COMP%] {\n  left: 50%;\n  bottom: calc(100% + 1.15rem);\n  transform: translateX(-50%);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.12rem;\n  padding: 0.28rem;\n  border-radius: 999px;\n}\n.chat-quick-reactions.chat-quick-reactions-down[_ngcontent-%COMP%] {\n  top: 1.72rem;\n  bottom: auto;\n}\n.chat-quick-reactions.chat-quick-reactions-tools-down[_ngcontent-%COMP%] {\n  top: calc(100% + 1.25rem);\n  bottom: auto;\n}\n.chat-message.mine[_ngcontent-%COMP%]   .chat-quick-reactions[_ngcontent-%COMP%] {\n  left: 50%;\n  right: auto;\n}\n.chat-quick-reactions[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  font-size: 1.06rem;\n}\n@media (hover: hover) and (pointer: fine) {\n  .chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, \n   .chat-quick-reactions[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%]:hover {\n    background: #eef4ff;\n  }\n}\n.chat-message-action-trigger[_ngcontent-%COMP%] {\n  display: block;\n  width: 28px;\n  height: 28px;\n}\n[_nghost-%COMP%]     .chat-message-action-trigger .app-menu__trigger {\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n  border: 0;\n  background: transparent;\n  color: #446280;\n  box-shadow: none;\n}\n[_nghost-%COMP%]     .chat-message-action-trigger .app-menu__trigger--open {\n  background: #eef4ff;\n}\n[_nghost-%COMP%]     .chat-message-action-trigger .app-menu__trigger .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n@media (hover: none), (pointer: coarse) {\n  .chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(.chat-tool-btn-open):hover, \n   .chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(.chat-tool-btn-open):active, \n   .chat-message-tools[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(.chat-tool-btn-open):focus {\n    background: transparent;\n    outline: none;\n  }\n  .chat-message-tools[_ngcontent-%COMP%]   button.chat-tool-btn-open[_ngcontent-%COMP%]:hover, \n   .chat-message-tools[_ngcontent-%COMP%]   button.chat-tool-btn-open[_ngcontent-%COMP%]:active, \n   .chat-message-tools[_ngcontent-%COMP%]   button.chat-tool-btn-open[_ngcontent-%COMP%]:focus {\n    background: #eef4ff;\n    outline: none;\n  }\n}\n.chat-message.chat-message-fresh[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_chat-message-pop 0.34s ease-out;\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%], \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%] {\n  isolation: isolate;\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::before, \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::before, \n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::after, \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  z-index: 0;\n  padding: 2px;\n  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  -webkit-mask-composite: xor;\n  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  mask-composite: exclude;\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::before, \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::before {\n  background: rgba(133, 100, 42, 0.18);\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::after {\n  --chat-progress-angle: 0deg;\n  background:\n    conic-gradient(\n      from 0deg,\n      rgb(235, 147, 33) 0deg,\n      rgb(247, 190, 52) var(--chat-progress-angle),\n      transparent var(--chat-progress-angle),\n      transparent 360deg);\n  animation: _ngcontent-%COMP%_chat-message-border-progress var(--chat-pending-progress-duration) linear forwards;\n}\n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]::after {\n  background:\n    linear-gradient(\n      135deg,\n      rgb(213, 54, 68),\n      rgb(196, 29, 42));\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-message-content[_ngcontent-%COMP%], \n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-sender-avatar[_ngcontent-%COMP%] {\n  opacity: 0.9;\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%], \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.chat-message.chat-message-pending[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]    > .chat-reaction-summary[_ngcontent-%COMP%], \n.chat-message.chat-message-timed-out[_ngcontent-%COMP%]   .chat-bubble[_ngcontent-%COMP%]    > .chat-reaction-summary[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 4;\n}\n.chat-readers[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.28rem;\n  bottom: -0.62rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.14rem;\n}\n.chat-reader[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  color: #fff;\n  font-size: 8px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);\n  overflow: hidden;\n}\n.chat-reader[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.chat-reader.chat-reader-fresh[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_chat-reader-pulse 0.44s ease-out;\n}\n.chat-typing-indicator[_ngcontent-%COMP%] {\n  min-height: 24px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  margin: -0.06rem 0 0.08rem;\n  padding: 0 0.18rem;\n  color: rgba(36, 64, 99, 0.78);\n  font-size: 0.74rem;\n  font-weight: 700;\n}\n.chat-typing-indicator-dots[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n}\n.chat-typing-indicator-dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: rgba(46, 104, 159, 0.72);\n  animation: _ngcontent-%COMP%_chat-typing-bounce 1s ease-in-out infinite;\n}\n.chat-typing-indicator-dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.12s;\n}\n.chat-typing-indicator-dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.24s;\n}\n.chat-compose-box[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 70;\n  background: #fff;\n  padding-top: 0.18rem;\n  margin-top: 0;\n  min-height: 42px;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.35rem;\n}\n.chat-composer-app-menu[_ngcontent-%COMP%] {\n  display: block;\n}\n.chat-voice-composer[_ngcontent-%COMP%] {\n  --chat-voice-control-size: 28px;\n  --chat-voice-control-gap: 0.46rem;\n  position: relative;\n  min-width: 0;\n  flex: 1 1 auto;\n  height: 38px;\n  min-height: 0;\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: var(--chat-voice-control-size) minmax(0, 1fr) auto var(--chat-voice-control-size);\n  align-items: center;\n  gap: var(--chat-voice-control-gap);\n  padding: 0 0.22rem;\n  border: 1px solid rgba(192, 19, 154, 0.28);\n  border-radius: 999px;\n  background: #d100a7;\n  color: #fff;\n  line-height: 1;\n}\n.chat-voice-composer[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  align-self: center;\n}\n.chat-voice-cancel-btn[_ngcontent-%COMP%], \n.chat-voice-record-btn[_ngcontent-%COMP%], \n.chat-voice-send-btn[_ngcontent-%COMP%] {\n  width: var(--chat-voice-control-size);\n  height: var(--chat-voice-control-size);\n  box-sizing: border-box;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 var(--chat-voice-control-size);\n  line-height: 0;\n  cursor: pointer;\n}\n.chat-voice-cancel-btn[_ngcontent-%COMP%] {\n  width: var(--chat-voice-control-size) !important;\n  min-width: var(--chat-voice-control-size) !important;\n  max-width: var(--chat-voice-control-size) !important;\n  height: var(--chat-voice-control-size) !important;\n  min-height: var(--chat-voice-control-size) !important;\n  max-height: var(--chat-voice-control-size) !important;\n  padding: 0 !important;\n  border: 0 !important;\n  border-color: transparent !important;\n  background: rgba(255, 255, 255, 0.2);\n  color: #fff;\n}\n.chat-voice-record-btn[_ngcontent-%COMP%], \n.chat-voice-send-btn[_ngcontent-%COMP%] {\n  background: #fff;\n  color: #c0139a;\n}\n.chat-voice-record-btn.is-recording[_ngcontent-%COMP%] {\n  color: #d1002f;\n}\n.chat-voice-send-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.chat-voice-cancel-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.chat-voice-record-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.chat-voice-send-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.chat-voice-recorder-shell[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: var(--chat-voice-control-size);\n  display: flex;\n  align-items: center;\n  gap: var(--chat-voice-control-gap);\n}\n.chat-voice-bars[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: var(--chat-voice-control-size);\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n}\n.chat-voice-bars[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 3px;\n  height: 12px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.78);\n}\n.chat-voice-bars[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2), \n.chat-voice-bars[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(4) {\n  height: 16px;\n}\n.chat-voice-bars[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {\n  height: 20px;\n}\n.chat-voice-bars.is-recording[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_chat-voice-bar-pulse 0.82s ease-in-out infinite alternate;\n}\n.chat-voice-bars.is-recording[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.08s;\n}\n.chat-voice-bars.is-recording[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.16s;\n}\n.chat-voice-bars.is-recording[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.24s;\n}\n.chat-voice-bars.is-recording[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.32s;\n}\n.chat-voice-timer[_ngcontent-%COMP%] {\n  min-width: 42px;\n  height: var(--chat-voice-control-size);\n  box-sizing: border-box;\n  padding: 0 0.38rem;\n  border-radius: 999px;\n  background: #fff;\n  color: #c0139a;\n  font-size: 0.78rem;\n  line-height: 1;\n  font-weight: 900;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n.chat-voice-review-player[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 28px;\n}\n.chat-voice-error[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.75rem;\n  right: 0.75rem;\n  bottom: calc(100% + 0.22rem);\n  min-width: 0;\n  padding: 0.18rem 0.46rem;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.88);\n  color: #fff;\n  font-size: 0.7rem;\n  font-weight: 800;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  pointer-events: none;\n}\n.chat-poll-composer[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  padding: 0.85rem;\n}\n.chat-poll-composer-header[_ngcontent-%COMP%] {\n  display: block;\n}\n.chat-poll-composer[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  height: 34px;\n  border: 0;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 0;\n  background: transparent;\n  color: #17243a;\n  font-size: 0.86rem;\n  font-weight: 750;\n  outline: none;\n}\n.chat-poll-composer-header[_ngcontent-%COMP%]    > input[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.chat-poll-composer-option[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(32, 51, 78, 0.58);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.chat-poll-composer-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-poll-composer-options[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n}\n.chat-poll-composer-option[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 30px;\n  gap: 0.45rem;\n  align-items: center;\n}\n.chat-poll-composer-actions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n}\n.chat-poll-add-option-btn[_ngcontent-%COMP%], \n.chat-poll-create-btn[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 0;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  font-weight: 850;\n  cursor: pointer;\n}\n.chat-poll-add-option-btn[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  background: transparent;\n  color: rgba(32, 51, 78, 0.68);\n}\n.chat-poll-add-option-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-poll-create-btn[_ngcontent-%COMP%] {\n  background: #e8f2ff;\n  color: #0064d8;\n}\n.chat-poll-create-btn[_ngcontent-%COMP%]:disabled, \n.chat-poll-add-option-btn[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.55;\n}\n@keyframes _ngcontent-%COMP%_chat-voice-bar-pulse {\n  from {\n    transform: scaleY(0.55);\n    opacity: 0.72;\n  }\n  to {\n    transform: scaleY(1);\n    opacity: 1;\n  }\n}\n.chat-compose-plus-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  align-self: center;\n  display: inline-flex;\n}\n.chat-compose-plus-btn[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  padding: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 54, 82, 0.2);\n  border-radius: 50%;\n  background: #fff;\n  color: #365a85;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  line-height: 1;\n  align-self: center;\n}\n.chat-compose-plus-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  display: block;\n}\n[_nghost-%COMP%]     .chat-composer-app-menu .app-menu__trigger {\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  padding: 0;\n  border-color: rgba(33, 54, 82, 0.2);\n  background: #fff;\n  color: #365a85;\n  box-shadow: none;\n}\n[_nghost-%COMP%]     .chat-composer-app-menu .app-menu__trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.chat-attachment-input[_ngcontent-%COMP%] {\n  display: none;\n}\n.chat-ascii-emoji-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 2.4rem;\n  right: 2.5rem;\n  bottom: calc(100% + 0.36rem);\n  z-index: 48;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.32rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 14px 34px rgba(17, 24, 39, 0.16);\n  overflow-x: auto;\n}\n.chat-ascii-emoji-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 62px;\n  height: 42px;\n  padding: 0.2rem 0.42rem;\n  border: 0;\n  border-radius: 8px;\n  background: #f3f7fc;\n  color: #20334e;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  column-gap: 0.28rem;\n  align-items: center;\n  cursor: pointer;\n}\n.chat-ascii-emoji-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, \n.chat-ascii-emoji-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus-visible {\n  background: #e8f2ff;\n  outline: none;\n}\n.chat-ascii-emoji-panel__emoji[_ngcontent-%COMP%] {\n  grid-row: 1/3;\n  font-size: 1.2rem;\n  line-height: 1;\n}\n.chat-ascii-emoji-panel__token[_ngcontent-%COMP%], \n.chat-ascii-emoji-panel[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-align: left;\n}\n.chat-ascii-emoji-panel__token[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.chat-ascii-emoji-panel[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(47, 66, 94, 0.64);\n  font-size: 0.64rem;\n  font-weight: 750;\n}\n.chat-compose-box[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  width: auto;\n  min-width: 0;\n  height: 42px;\n  min-height: 42px;\n  max-height: 140px;\n  box-sizing: border-box;\n  border: 1px solid rgba(36, 63, 98, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  color: #1c3557;\n  font: inherit;\n  font-size: 0.84rem;\n  line-height: 1.4;\n  padding: 0.65rem 0.72rem;\n  resize: none;\n  overflow-y: auto;\n}\n.chat-reply-draft[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  margin-bottom: 0.24rem;\n  padding: 0.42rem 0.52rem;\n  border-radius: 10px;\n  background: #eef4ff;\n  color: #365a85;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.chat-reply-draft[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.chat-reply-draft-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.chat-reply-draft-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: rgba(24, 38, 60, 0.92);\n  line-height: 1.15;\n}\n.chat-reply-draft-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(47, 66, 94, 0.7);\n  font-size: 0.76rem;\n  font-weight: 600;\n  line-height: 1.25;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-reply-draft[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n}\n.chat-reply-draft[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.chat-compose-box[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  outline: 2px solid rgba(66, 110, 182, 0.34);\n  outline-offset: 0;\n  border-color: rgba(66, 110, 182, 0.52);\n}\n.chat-send-btn[_ngcontent-%COMP%] {\n  position: static;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(33, 54, 82, 0.2);\n  background: #fff;\n  color: #365a85;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  align-self: center;\n}\n.chat-send-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-send-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.52;\n  cursor: default;\n}\n.chat-poll-vote-body[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.72rem;\n  padding: 1.65rem 1.5rem 1.2rem;\n}\n.chat-poll-vote-body[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  color: rgba(16, 29, 49, 0.96);\n  font-size: 1.05rem;\n  line-height: 1.2;\n}\n.chat-poll-vote-options[_ngcontent-%COMP%] {\n  margin-top: 0.28rem;\n  display: grid;\n  gap: 0;\n}\n.chat-poll-vote-option[_ngcontent-%COMP%] {\n  min-height: 56px;\n  display: grid;\n  grid-template-columns: 22px minmax(0, 1fr);\n  align-items: center;\n  gap: 0.72rem;\n  padding: 0;\n  border: 0;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.12);\n  background: transparent;\n  color: rgba(16, 29, 49, 0.96);\n  text-align: left;\n  font-size: 0.9rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.chat-poll-vote-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.85rem;\n  padding: 1.1rem 1rem 1rem;\n}\n.chat-reaction-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.35rem;\n  padding: 0.8rem 1rem 0;\n}\n.chat-reaction-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  border-bottom: 3px solid transparent;\n  background: transparent;\n  color: #245b9f;\n  padding: 0.45rem 0.2rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.chat-reaction-tabs[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  border-bottom-color: #2f75ff;\n}\n.chat-reaction-list[_ngcontent-%COMP%], \n.chat-pinned-list[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.chat-pinned-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  max-height: min(62vh, 34rem);\n  overflow: auto;\n}\n.chat-reaction-row[_ngcontent-%COMP%], \n.chat-pinned-row[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  padding: 0.55rem;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  color: #22324a;\n  text-align: left;\n}\n.chat-reaction-avatar[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-weight: 800;\n  font-size: 0.75rem;\n}\n.chat-reaction-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.chat-pinned-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.12rem;\n  color: rgba(34, 50, 74, 0.62);\n}\n.chat-reaction-row-emoji[_ngcontent-%COMP%] {\n  margin-left: auto;\n  font-size: 1.35rem;\n}\n.chat-pinned-message[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.48rem;\n  padding: 0.6rem 0.7rem 0.9rem;\n  border: 1px solid rgba(55, 97, 154, 0.32);\n  border-radius: 11px;\n  background: #e9f2ff;\n  color: rgba(16, 29, 49, 0.88);\n  text-align: left;\n  cursor: pointer;\n  box-shadow: 0 12px 26px rgba(24, 42, 68, 0.09);\n}\n.chat-pinned-message-content[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.18rem;\n  flex: 1 1 auto;\n}\n.chat-pinned-message[_ngcontent-%COMP%]   .chat-meta-row[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.chat-pinned-attachment[_ngcontent-%COMP%] {\n  color: rgba(34, 50, 74, 0.62);\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.chat-pinned-image-preview[_ngcontent-%COMP%] {\n  display: block;\n  width: min(260px, 100%);\n  margin-top: 0.22rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  overflow: hidden;\n  background: rgba(255, 255, 255, 0.72);\n}\n.chat-pinned-image-preview[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: clamp(96px, 22vw, 150px);\n  object-fit: contain;\n}\n.chat-pinned-dialog-pin[_ngcontent-%COMP%] {\n  top: -0.48rem;\n  right: 0.32rem;\n}\n.chat-pinned-reaction-summary[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.32rem;\n  bottom: -0.62rem;\n}\n.chat-pinned-readers[_ngcontent-%COMP%] {\n  right: 0.28rem;\n  bottom: -0.62rem;\n}\n@keyframes _ngcontent-%COMP%_chat-message-pop {\n  0% {\n    transform: translateY(10px) scale(0.97);\n    opacity: 0.2;\n  }\n  100% {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_chat-reader-pulse {\n  0% {\n    transform: scale(0.7);\n    box-shadow: 0 0 0 0 rgba(46, 104, 159, 0.3);\n  }\n  70% {\n    transform: scale(1.12);\n    box-shadow: 0 0 0 10px rgba(46, 104, 159, 0);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);\n  }\n}\n@keyframes _ngcontent-%COMP%_chat-message-border-progress {\n  0% {\n    --chat-progress-angle: 0deg;\n  }\n  100% {\n    --chat-progress-angle: 360deg;\n  }\n}\n@keyframes _ngcontent-%COMP%_chat-message-reply-highlight {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(66, 110, 182, 0);\n  }\n  35% {\n    transform: scale(1.035);\n    box-shadow: 0 0 0 4px rgba(66, 110, 182, 0.18), 0 18px 38px rgba(24, 42, 68, 0.14);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 2px rgba(66, 110, 182, 0.18), 0 16px 34px rgba(24, 42, 68, 0.12);\n  }\n}\n@keyframes _ngcontent-%COMP%_chat-typing-bounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.35;\n  }\n  40% {\n    transform: translateY(-3px);\n    opacity: 1;\n  }\n}\n@media (max-width: 760px) {\n  .chat-compose-box[_ngcontent-%COMP%] {\n    min-height: 40px;\n    padding-top: 0;\n  }\n  .chat-compose-box[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n    height: 40px;\n    min-height: 40px;\n    border-radius: 10px;\n    padding-top: 0.58rem;\n    padding-bottom: 0.58rem;\n  }\n  .chat-popup-box[_ngcontent-%COMP%] {\n    height: 100%;\n    min-height: 0;\n    padding: 0.45rem;\n    gap: 0.34rem;\n  }\n  .chat-thread[_ngcontent-%COMP%] {\n    flex: 1;\n    max-height: none;\n  }\n  .chat-compose-box[_ngcontent-%COMP%] {\n    position: relative;\n    left: auto;\n    right: auto;\n    bottom: auto;\n    z-index: 70;\n    margin-top: 0;\n    padding: 0.45rem 0.45rem max(0.45rem, env(safe-area-inset-bottom, 0px));\n    background: #fff;\n    box-shadow: 0 -4px 14px rgba(15, 29, 47, 0.08);\n    transform: none;\n    will-change: auto;\n    backface-visibility: visible;\n  }\n  .chat-compose-box[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n    resize: none;\n  }\n  .chat-bubble[_ngcontent-%COMP%] {\n    max-width: 78%;\n  }\n  .chat-card-attachment[_ngcontent-%COMP%] {\n    width: min(340px, 100%);\n  }\n  .chat-voice-attachment[_ngcontent-%COMP%] {\n    width: min(240px, 100%);\n    min-width: 190px;\n  }\n  .chat-voice-attachment-player[_ngcontent-%COMP%], \n   .chat-voice-attachment[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%] {\n    min-width: 160px;\n  }\n  .chat-poll-attachment[_ngcontent-%COMP%] {\n    width: 200px;\n  }\n  .chat-message[_ngcontent-%COMP%] {\n    margin-bottom: 0.8rem;\n  }\n  .chat-thread-list--reverse[_ngcontent-%COMP%]   .chat-message[_ngcontent-%COMP%]:first-child {\n    margin-bottom: 1.35rem;\n  }\n  .chat-thread-list--reverse[_ngcontent-%COMP%]   .chat-message[_ngcontent-%COMP%]:last-child {\n    margin-bottom: 0.8rem;\n  }\n}\n/*# sourceMappingURL=event-chat-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventChatPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-chat-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      PopupComponent,
      AppMenuComponent,
      AppMenuTriggerComponent,
      SmartListComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (session(); as chatSession) {
  <app-popup
    class="event-chat-popup-shell"
    [style.--chat-shell-z-index]="chatPopupZIndex(chatSession)"
    [style.--chat-compose-detached-space.px]="chatComposeDetachedSpace"
    [model]="chatPopupModel(chatSession)"
    [zIndex]="chatPopupZIndex(chatSession)"
    [attr.data-chat-id]="chatSession.item.id"
  >
    <div class="chat-popup-wrap">
      <div class="chat-popup-box">
        <app-smart-list
          #chatThreadSmartList
          [config]="chatThreadSmartListConfig"
          [loadPage]="chatThreadLoadPage"
          [itemTemplate]="chatThreadMessageTemplate"
          [query]="chatThreadQuery"
          (menuItemSelect)="onDispatchedChatMenuSelect($event)"
        ></app-smart-list>
        @if (typingIndicators.length > 0) {
          <div class="chat-typing-indicator">
            <span class="chat-typing-indicator-users">{{ typingIndicatorLabel() }}</span>
            <span class="chat-typing-indicator-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        }
        <div class="chat-compose-box" #chatComposeBox>
          @if (replyTarget) {
            <div class="chat-reply-draft">
              <span class="chat-reply-draft-copy">
                <strong>Replying to {{ replyTarget.sender }}</strong>
                <small>{{ replyTarget.text }}</small>
              </span>
              <button type="button" (click)="clearReplyTarget()" aria-label="Cancel reply">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          @if (editingMessageId) {
            <div class="chat-reply-draft chat-edit-draft">
              <span>
                <mat-icon>edit</mat-icon>
                Editing message
              </span>
              <button type="button" (click)="cancelEditing()" aria-label="Cancel edit">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          <span class="chat-compose-plus-wrap">
            <app-menu
              class="chat-composer-app-menu"
              kind="select"
              [trigger]="composerMenuTrigger()"
              [items]="composerMenuItems()"
              panelAlign="start"
              [openUp]="true"
              (itemSelect)="onInlineChatMenuSelect($event)"
            ></app-menu>
          </span>
          <input
            #imageAttachmentInput
            class="chat-attachment-input"
            type="file"
            accept="image/*"
            (change)="onImageAttachmentSelected($event)"
          />
              @if (voiceComposerOpen) {
                <div class="chat-voice-composer" (click)="$event.stopPropagation()">
                  <button
                    type="button"
                    class="chat-voice-cancel-btn"
                    aria-label="Cancel voice clip"
                    (click)="discardVoiceRecording($event)"
                    [disabled]="voiceRecordingState === 'saving'"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                  @if (voiceRecordingState === 'recorded' && voiceClipDataUrl) {
                    <audio class="chat-voice-review-player" controls controlsList="nodownload noplaybackrate" preload="metadata" [src]="voiceClipDataUrl"></audio>
                  } @else {
                    <span class="chat-voice-recorder-shell" [class.is-recording]="voiceRecordingState === 'recording'">
                      <button
                        type="button"
                        class="chat-voice-record-btn"
                        [class.is-recording]="voiceRecordingState === 'recording'"
                        [attr.aria-label]="voiceRecordingState === 'recording' ? 'Stop recording' : 'Start recording'"
                        (click)="voiceRecordingState === 'recording' ? stopVoiceRecording($event) : startVoiceRecording($event)"
                        [disabled]="voiceRecordingState === 'saving'"
                      >
                        <mat-icon>{{ voiceRecordingState === 'recording' ? 'stop' : 'mic' }}</mat-icon>
                      </button>
                      <span class="chat-voice-bars" [class.is-recording]="voiceRecordingState === 'recording'">
                        <span></span><span></span><span></span><span></span><span></span>
                      </span>
                    </span>
                  }
                  <span class="chat-voice-timer">{{ formatVoiceDuration(voiceRecorderSeconds) }}</span>
                  <button
                    type="button"
                    class="chat-voice-send-btn"
                    aria-label="Send voice clip"
                    (click)="sendVoiceClip($event)"
                    [disabled]="!canSendVoiceClip() || voiceRecordingState === 'saving'"
                  >
                    <mat-icon>{{ voiceRecordingState === 'saving' ? 'hourglass_empty' : 'send' }}</mat-icon>
                  </button>
                  @if (voiceRecorderError) {
                    <span class="chat-voice-error">{{ voiceRecorderError }}</span>
                  }
                </div>
              } @else {
                @if (composerEmojiSuggestions(); as emojiSuggestions) {
                  @if (emojiSuggestions.length > 0) {
                    <div class="chat-ascii-emoji-panel" role="listbox" aria-label="Emoji suggestions">
                      @for (suggestion of emojiSuggestions; track suggestion.token) {
                        <button
                          type="button"
                          role="option"
                          (mousedown)="$event.preventDefault()"
                          (click)="applyComposerEmojiSuggestion(suggestion, $event)"
                          [attr.aria-label]="suggestion.token + ' ' + suggestion.label"
                          >
                          <span class="chat-ascii-emoji-panel__emoji">{{ suggestion.emoji }}</span>
                          <span class="chat-ascii-emoji-panel__token">{{ suggestion.token }}</span>
                          <small>{{ suggestion.label }}</small>
                        </button>
                      }
                    </div>
                  }
                }
                <textarea
                  #messageTextarea
                  rows="1"
                  placeholder="Write message"
                  [(ngModel)]="draftMessage"
                  (ngModelChange)="onDraftMessageChange($event)"
                  (input)="resizeComposerTextarea()"
                  (keydown)="onComposerKeydown($event)"
                  [disabled]="chatInitialLoadPending"
                ></textarea>
                <button type="button" class="chat-send-btn" aria-label="Send message" (click)="sendMessage()" [disabled]="chatInitialLoadPending">
                  <mat-icon>send</mat-icon>
                </button>
              }
        </div>
      </div>
    </div>
  </app-popup>
}

@if (pollComposerOpen) {
  <app-popup [model]="createPollPopupModel()" [zIndex]="chatDialogZIndex()">
    <div class="chat-poll-composer">
      <div class="chat-poll-composer-header">
        <input
          type="text"
          placeholder="Ask a question"
          [(ngModel)]="pollQuestionDraft"
          [disabled]="chatInitialLoadPending"
        />
      </div>
      <div class="chat-poll-composer-options">
        @for (option of pollOptionDrafts; track $index; let index = $index) {
          <span class="chat-poll-composer-option">
            <input
              type="text"
              [placeholder]="'Option ' + (index + 1)"
              [(ngModel)]="pollOptionDrafts[index]"
              [disabled]="chatInitialLoadPending"
            />
            <button type="button" [attr.aria-label]="'Remove option ' + (index + 1)" (click)="removePollOption(index, $event)">
              <mat-icon>close</mat-icon>
            </button>
          </span>
        }
      </div>
      <div class="chat-poll-composer-actions">
        <button type="button" class="chat-poll-add-option-btn" (click)="addPollOption($event)" [disabled]="pollOptionDrafts.length >= 6">
          <mat-icon>add_circle</mat-icon>
          Add option...
        </button>
        <button type="button" class="chat-poll-create-btn" (click)="sendPoll($event)" [disabled]="!canCreatePoll()">
          Create Poll
        </button>
      </div>
    </div>
  </app-popup>
}

<ng-template #chatThreadMessageTemplate let-message let-groupLabel="groupLabel">
  <article
    class="chat-message"
    [class.mine]="message.mine"
    [class.chat-message-fresh]="isFreshMessage(message.id)"
    [class.chat-message-pending]="message.deliveryState === 'pending'"
    [class.chat-message-timed-out]="message.deliveryState === 'timed-out'"
    [class.chat-message-selected]="selectedMessageId && selectedMessageId === message.id"
    [class.chat-message-highlighted]="highlightedMessageId && highlightedMessageId === message.id"
    [class.chat-message-deleted]="message.deletedAtIso"
    (click)="selectMessage(message, $event)"
    (touchstart)="startMessageLongPress(message)"
    (touchend)="clearMessageLongPress()"
    (touchcancel)="clearMessageLongPress()"
    [attr.data-group-label]="groupLabel"
    [attr.data-chat-message-id]="message.id"
    >
    @if (!message.deletedAtIso && message.replyTo) {
      <button
        type="button"
        class="chat-message-reply-context"
        (click)="jumpToReplySource(message, $event)"
        (contextmenu)="$event.preventDefault(); $event.stopPropagation()"
        aria-label="Open replied message"
        >
        <span class="chat-message-reply-label">
          <mat-icon>reply</mat-icon>
          {{ message.mine ? 'You replied' : message.sender + ' replied' }} to {{ message.replyTo.sender }}
        </span>
        @if (replyPreviewParts(message.replyTo); as replyPreview) {
          <span class="chat-message-reply-quote" [class.chat-message-reply-quote--structured]="replyPreview.meta">
            <span class="chat-message-reply-title">{{ replyPreview.title }}</span>
            @if (replyPreview.meta) {
              <span class="chat-message-reply-meta">{{ replyPreview.meta }}</span>
            }
          </span>
        }
      </button>
    }
    <div class="chat-bubble">
      @if (!message.deletedAtIso) {
        <span class="chat-sender-avatar" [class]="'user-color-' + message.senderAvatar.gender">
          @if (message.senderAvatar.gender === 'system') {
            <mat-icon>auto_awesome</mat-icon>
          } @else if (message.senderAvatar.imageUrl) {
            <img [src]="message.senderAvatar.imageUrl" [alt]="message.sender" loading="lazy" decoding="async" />
          } @else {
            {{ message.senderAvatar.initials }}
          }
        </span>
      }
      <div class="chat-message-content">
        @if (!message.deletedAtIso) {
          <div class="chat-meta-row">
            <span class="chat-sender-name">{{ message.sender }}</span>
            <span class="chat-time-chip">{{ message.time }}</span>
          </div>
        }
        @if (message.deletedAtIso) {
          <p class="chat-line chat-line-deleted">{{ deletedMessageLabel(message) }}</p>
        } @else {
          @if ((message.attachments ?? []).length > 0) {
            <div class="chat-attachment-stack">
              @for (attachment of message.attachments; track attachment.id) {
                @if (attachment.type === 'image') {
                  <figure class="chat-image-attachment">
                    @if (attachment.previewUrl || attachment.url) {
                      <img
                        [src]="attachment.previewUrl || attachment.url"
                        [alt]="attachment.title"
                        loading="lazy"
                        decoding="async"
                      />
                    }
                  </figure>
                } @else if (attachment.type === 'voice') {
                  <div class="chat-voice-attachment">
                    <span class="chat-voice-attachment-icon">
                      <mat-icon>mic</mat-icon>
                    </span>
                    <span class="chat-voice-attachment-copy">
                      <strong>{{ attachment.title || 'Voice clip' }}</strong>
                      @if (attachment.subtitle) {
                        <small>{{ attachment.subtitle }}</small>
                      }
                    </span>
                    @if (voiceAttachmentAudioSrc(attachment)) {
                      <span class="chat-voice-attachment-player">
                        <audio controls controlsList="nodownload noplaybackrate" preload="metadata" [src]="voiceAttachmentAudioSrc(attachment)"></audio>
                      </span>
                    } @else {
                      <small class="chat-voice-attachment-missing">Audio unavailable</small>
                    }
                  </div>
                } @else if (attachment.type === 'poll') {
                  @if (pollState(attachment); as poll) {
                    <div class="chat-poll-attachment">
                      <strong>{{ poll.question }}</strong>
                      <div class="chat-poll-options">
                        @for (option of poll.options; track option.id) {
                          <div class="chat-poll-option">
                            <span class="chat-poll-option-row">
                              <span class="chat-poll-option-text">{{ option.text }}</span>
                              <span class="chat-poll-voters">
                                @for (vote of option.votes.slice(0, 3); track vote.userId) {
                                  <span class="chat-poll-voter-avatar" [class]="'user-color-' + vote.gender">{{ vote.initials }}</span>
                                }
                              </span>
                            </span>
                            <span class="chat-poll-bar">
                              <span [style.width.%]="pollOptionPercent(poll, option)"></span>
                            </span>
                          </div>
                        }
                      </div>
                      <button
                        type="button"
                        class="chat-poll-vote-btn"
                        (click)="openPollVoteDialog(message, attachment, $event)"
                      >
                        {{ pollOwnVoteOptionId(attachment) ? 'Change vote' : 'Vote' }}
                      </button>
                    </div>
                  }
                } @else if (attachment.type === 'event' || attachment.type === 'asset' || attachment.type === 'link') {
                  <div
                    class="chat-card-attachment"
                    [class.chat-card-attachment-event]="attachment.type === 'event'"
                    [class.chat-card-attachment-asset]="attachment.type === 'asset'"
                    [class.chat-card-attachment-link]="attachment.type === 'link'"
                    [class.chat-card-attachment-unavailable]="isAttachmentUnavailable(attachment)"
                    [attr.aria-disabled]="isAttachmentUnavailable(attachment)"
                    >
                    @if (attachment.previewUrl) {
                      <span class="chat-card-attachment-media">
                        <img [src]="attachment.previewUrl" [alt]="attachment.title" loading="lazy" decoding="async" />
                      </span>
                    }
                    <span class="chat-card-attachment-copy">
                      <span class="chat-card-attachment-kicker">
                        <mat-icon>{{ chatAttachmentIcon(attachment) }}</mat-icon>
                        {{ chatAttachmentTypeLabel(attachment) }}
                      </span>
                      <strong>{{ attachment.title }}</strong>
                      @if (isAttachmentUnavailable(attachment)) {
                        <small class="chat-card-attachment-status">{{ unavailableAttachmentLabel(attachment) }}</small>
                      }
                      @if (attachment.subtitle) {
                        <small>{{ attachment.subtitle }}</small>
                      }
                      @if (attachment.description) {
                        <span class="chat-card-attachment-description">{{ attachment.description }}</span>
                      }
                    </span>
                  </div>
                }
              }
            </div>
          }
          @if (message.text) {
            <p class="chat-line">
              @for (segment of chatTextSegments(message.text); track segment.id) {
                @if (segment.url) {
                  <button type="button" class="chat-line-link" (click)="openChatTextLink(segment.url, $event)">{{ segment.text }}</button>
                } @else {
                  <span>{{ segment.text }}</span>
                }
              }
            </p>
          }
          @if (message.editedAtIso) {
            <span class="chat-edited-label">Edited</span>
          }
        }
      </div>
      @if (!message.deletedAtIso && message.pinnedAtIso) {
        <span class="chat-pin-badge" aria-label="Pinned message">
          <mat-icon>push_pin</mat-icon>
        </span>
      }
      @if (!message.deletedAtIso && (message.reactions ?? []).length > 0) {
        <button type="button" class="chat-reaction-summary" (click)="openReactionDetails(message, $event)">
          @for (reaction of reactionSummary(message); track reaction.emoji) {
            <span>{{ reaction.emoji }} {{ reaction.count }}</span>
          }
        </button>
      }
      @if (message.id && selectedMessageId === message.id && !message.deletedAtIso) {
        <div class="chat-message-tools" [class.chat-message-tools-down]="selectedMessageToolsDown" (click)="$event.stopPropagation()">
          <button type="button" (click)="setReplyTarget(message, $event)" aria-label="Reply">
            <mat-icon>reply</mat-icon>
          </button>
          <button
            type="button"
            [class.chat-tool-btn-open]="quickReactionMessageId && quickReactionMessageId === message.id"
            (click)="toggleQuickReactions(message, $event)"
            aria-label="React"
            >
            <mat-icon>{{ quickReactionMessageId && quickReactionMessageId === message.id ? 'add_reaction' : 'mood' }}</mat-icon>
          </button>
          <app-menu-trigger
            class="chat-message-action-trigger"
            [menuId]="messageActionMenuIdFor(message)"
            kind="select"
            [trigger]="messageActionMenuTrigger(message)"
            [items]="messageActionMenuItems(message)"
            panelAlign="auto"
          ></app-menu-trigger>
        </div>
      }
      @if (message.id && quickReactionMessageId === message.id) {
        <div
          class="chat-quick-reactions"
          [class.chat-quick-reactions-down]="quickReactionOpenDown"
          [class.chat-quick-reactions-tools-down]="selectedMessageToolsDown"
          (click)="$event.stopPropagation()"
          >
          @for (emoji of quickReactionEmojis; track emoji) {
            <button type="button" (click)="toggleReaction(message, emoji, $event)">{{ emoji }}</button>
          }
          @if (isMobileView()) {
            <app-menu-trigger
              class="chat-emoji-menu"
              menuId="chat-mobile-emoji-picker"
              kind="select"
              title="Search emoji"
              [trigger]="emojiPickerMenuTrigger()"
              [model]="emojiPickerMenuModel()"
              [filterable]="true"
              panelMode="sheet"
              [closeOnSelect]="true"
            ></app-menu-trigger>
          } @else {
            <app-menu
              class="chat-emoji-menu"
              kind="select"
              title="Search emoji"
              [trigger]="emojiPickerMenuTrigger()"
              [model]="emojiPickerMenuModel()"
              [filterable]="true"
              panelAlign="auto"
              [closeOnSelect]="true"
              (itemSelect)="onEmojiPickerMenuSelect(message, $event)"
            ></app-menu>
          }
        </div>
      }
      @if (message.id && !message.deletedAtIso && visibleReadReceiptsByMessageId[message.id]; as visibleReaders) {
        @if (visibleReaders.length > 0) {
          <div class="chat-readers">
            @for (reader of visibleReaders; track trackByChatReader($index, reader)) {
              <span
                class="chat-reader"
                [class]="'user-color-' + reader.gender"
                [class.chat-reader-fresh]="isFreshRead(message.id, reader.id)"
                >
                @if (reader.imageUrl) {
                  <img [src]="reader.imageUrl" [alt]="reader.initials" loading="lazy" decoding="async" />
                } @else {
                  {{ reader.initials }}
                }
              </span>
            }
          </div>
        }
      }
    </div>
  </article>
</ng-template>

@if (reactionDetailsMessage(); as reactionMessage) {
  <app-popup [model]="reactionDetailsPopupModel()" [zIndex]="chatDialogZIndex()">
    <div class="chat-reaction-tabs">
      <button type="button" [class.active]="reactionDetailsFilter === 'all'" (click)="reactionDetailsFilter = 'all'">All {{ reactionMessage.reactions?.length ?? 0 }}</button>
      @for (reaction of reactionSummary(reactionMessage); track reaction.emoji) {
        <button type="button" [class.active]="reactionDetailsFilter === reaction.emoji" (click)="reactionDetailsFilter = reaction.emoji">{{ reaction.emoji }} {{ reaction.count }}</button>
      }
    </div>
    <div class="chat-reaction-list">
      @for (reaction of reactionDetailsRows(reactionMessage); track reaction.userId + reaction.emoji) {
        <div class="chat-reaction-row">
          <span class="chat-reaction-avatar" [class]="'user-color-' + reaction.userGender">{{ reaction.userInitials }}</span>
          <span>
            <strong>{{ reaction.userName }}</strong>
            <small>Reacted with {{ reaction.emoji }}</small>
          </span>
          <span class="chat-reaction-row-emoji">{{ reaction.emoji }}</span>
        </div>
      }
    </div>
  </app-popup>
}

@if (pollVoteDialogContext(); as pollContext) {
  <app-popup [model]="pollVotePopupModel()" [zIndex]="chatDialogZIndex()">
    <div class="chat-poll-vote-body">
      <strong>{{ pollContext.poll.question }}</strong>
      <div class="chat-poll-vote-options">
        @for (option of pollContext.poll.options; track option.id) {
          <button
            type="button"
            class="chat-poll-vote-option"
            [class.is-selected]="selectedPollOptionId(pollContext.message, pollContext.attachment) === option.id"
            (click)="selectPollOption(pollContext.message, pollContext.attachment, option, $event)"
          >
            <span class="chat-poll-check">
              @if (selectedPollOptionId(pollContext.message, pollContext.attachment) === option.id) {
                <mat-icon>check</mat-icon>
              }
            </span>
            <span>{{ option.text }}</span>
          </button>
        }
      </div>
    </div>
    <footer class="chat-poll-vote-actions">
      <app-menu
        kind="inline"
        layout="row"
        [items]="pollVoteActionMenuItems(pollContext.message, pollContext.attachment)"
        (itemSelect)="onPollVoteActionSelect(pollContext.message, pollContext.attachment, $event)"
      ></app-menu>
    </footer>
  </app-popup>
}

@if (pinnedDialogOpen) {
  <app-popup [model]="pinnedMessagesPopupModel()" [zIndex]="chatDialogZIndex()">
    <div class="chat-pinned-list">
      @for (message of pinnedMessages(); track message.id) {
        <button type="button" class="chat-pinned-message" (click)="selectPinnedMessage(message)">
          <span class="chat-sender-avatar" [class]="'user-color-' + message.senderAvatar.gender">
            @if (message.senderAvatar.gender === 'system') {
              <mat-icon>auto_awesome</mat-icon>
            } @else if (message.senderAvatar.imageUrl) {
              <img [src]="message.senderAvatar.imageUrl" [alt]="message.sender" loading="lazy" decoding="async" />
            } @else {
              {{ message.senderAvatar.initials }}
            }
          </span>
          <span class="chat-pinned-message-content">
            <span class="chat-meta-row">
              <strong class="chat-sender-name">{{ message.sender }}</strong>
              <span class="chat-time-chip">{{ message.time }}</span>
            </span>
            @if ((message.attachments ?? []).length > 0) {
              <span class="chat-pinned-attachment">{{ chatAttachmentSummary(message) }}</span>
              @for (attachment of message.attachments; track attachment.id) {
                @if (attachment.type === 'image' && (attachment.previewUrl || attachment.url)) {
                  <span class="chat-pinned-image-preview">
                    <img
                      [src]="attachment.previewUrl || attachment.url"
                      [alt]="attachment.title"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                }
              }
            }
            @if (message.text) {
              <span class="chat-line">{{ message.text }}</span>
            }
          </span>
          <span class="chat-pin-badge chat-pinned-dialog-pin" aria-label="Pinned message">
            <mat-icon>push_pin</mat-icon>
          </span>
          @if ((message.reactions ?? []).length > 0) {
            <span class="chat-reaction-summary chat-pinned-reaction-summary">
              @for (reaction of reactionSummary(message); track reaction.emoji) {
                <span>{{ reaction.emoji }} {{ reaction.count }}</span>
              }
            </span>
          }
          @if (message.readBy.length > 0) {
            <span class="chat-readers chat-pinned-readers">
              @for (reader of message.readBy; track trackByChatReader($index, reader)) {
                <span class="chat-reader" [class]="'user-color-' + reader.gender">
                  @if (reader.imageUrl) {
                    <img [src]="reader.imageUrl" [alt]="reader.initials" loading="lazy" decoding="async" />
                  } @else {
                    {{ reader.initials }}
                  }
                </span>
              }
            </span>
          }
        </button>
      } @empty {
        <p>No pinned messages yet.</p>
      }
    </div>
  </app-popup>
}

@if (eventSubeventsStore.eventSubeventsListPopup()?.host === 'chat') {
  @if (eventSubeventsStore.eventSubeventsListPopupComponent(); as subeventsPopupComponent) {
    <ng-container *ngComponentOutlet="subeventsPopupComponent"></ng-container>
  }
}

@if (shouldHostChatResourcePopup()) {
  @if (resourcePopupStore.eventResourcePopupComponent(); as resourcePopupComponent) {
    <ng-container *ngComponentOutlet="resourcePopupComponent; inputs: resourcePopupOutletInputs()"></ng-container>
  }
}
@if (shouldHostChatResourcePopup() && resourcePopupStore.assetExplorePopupRef()) {
  @if (resourcePopupStore.eventResourceAssetExploreComponent(); as assetExplorePopupComponent) {
    <ng-container *ngComponentOutlet="assetExplorePopupComponent; inputs: assetExplorePopupOutletInputs()"></ng-container>
  }
}
@if (shouldHostChatSupplyContributionsPopup()) {
  @if (resourcePopupStore.eventSupplyContributionsPopupComponent(); as supplyContributionsComponent) {
    <ng-container *ngComponentOutlet="supplyContributionsComponent"></ng-container>
  }
}
`, styles: ['/* src/app/activity/components/event-chat-popup/event-chat-popup.component.scss */\n:host {\n  --text-main: #22324a;\n  --line: rgba(23, 33, 54, 0.12);\n  --chat-compose-detached-space: 108px;\n  --chat-pending-progress-duration: 3s;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n@property --chat-progress-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }\n.chat-popup-wrap {\n  display: grid;\n  gap: 0.62rem;\n  height: 100%;\n  min-height: 0;\n}\n.chat-popup-box {\n  border: 1px solid var(--line);\n  border-radius: 12px;\n  padding: 0.6rem;\n  display: grid;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  gap: 0.45rem;\n  overflow: visible;\n  min-height: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      180deg,\n      #f9fcff 0%,\n      #f3f8ff 100%);\n}\n.chat-popup-box > app-smart-list {\n  display: flex;\n  min-height: 0;\n  overflow: hidden;\n}\n.editor-list-card {\n  border: 1px solid rgba(56, 91, 138, 0.22);\n  border-radius: 12px;\n  padding: 0.9rem;\n  background: #fff;\n  color: rgba(23, 40, 63, 0.8);\n}\n.editor-list-card h4 {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.chat-thread {\n  max-height: none;\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: block;\n  padding: 0 0.12rem 1.1rem 0;\n}\n:host ::ng-deep .smart-list--list.chat-thread-list {\n  padding: 0 0.12rem 1.45rem 0;\n}\n.chat-day-sticky {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  justify-content: center;\n  margin: 0.08rem 0 0.3rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(245, 249, 255, 0.98) 0%,\n      rgba(245, 249, 255, 0.86) 70%,\n      rgba(245, 249, 255, 0) 100%);\n}\n.chat-day-pill {\n  border: 1px solid rgba(43, 74, 116, 0.2);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.94);\n  color: rgba(36, 64, 99, 0.88);\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.22rem 0.58rem;\n}\n.chat-message {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  width: 100%;\n  margin-bottom: 0.8rem;\n  position: relative;\n  z-index: 1;\n}\n.chat-message:has(.chat-readers) {\n  margin-bottom: 1.15rem;\n}\n.chat-message.mine {\n  align-items: flex-end;\n}\n.chat-bubble {\n  position: relative;\n  width: fit-content;\n  max-width: min(420px, 84%);\n  border: 1px solid rgba(16, 29, 49, 0.14);\n  border-radius: 11px;\n  background: #fff3f3;\n  padding: 0.44rem 0.56rem 0.48rem;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.48rem;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  cursor: pointer;\n}\n.chat-message-content,\n.chat-line {\n  cursor: inherit;\n}\n.chat-message-content {\n  flex: 0 1 auto;\n  max-width: min(360px, 100vw - 8rem);\n  min-width: 0;\n}\n.chat-message.mine .chat-bubble {\n  background: #e9f2ff;\n  border-color: rgba(55, 97, 154, 0.32);\n}\n.chat-bubble:has(.chat-voice-attachment) {\n  padding-right: 0.9rem;\n}\n.chat-bubble:has(.chat-image-attachment) {\n  max-width: fit-content;\n}\n.chat-bubble:has(.chat-image-attachment) .chat-message-content {\n  width: auto;\n  max-width: min(360px, 100vw - 7rem);\n  flex: 0 0 auto;\n}\n.chat-bubble:has(.chat-image-attachment) .chat-attachment-stack {\n  width: auto;\n  justify-items: start;\n}\n.chat-message.chat-message-deleted .chat-bubble,\n.chat-message.chat-message-deleted.mine .chat-bubble {\n  background: rgba(246, 248, 251, 0.92);\n  border-color: rgba(99, 113, 132, 0.22);\n  box-shadow: none;\n  cursor: default;\n}\n.chat-message.chat-message-deleted.chat-message-pending .chat-bubble,\n.chat-message.chat-message-deleted.chat-message-pending.mine .chat-bubble {\n  background: rgba(255, 238, 238, 0.96);\n  border-color: rgba(202, 72, 82, 0.34);\n}\n.chat-message:not(.mine) .chat-bubble {\n  border-color: rgba(176, 87, 87, 0.28);\n}\n.chat-message.chat-message-deleted:not(.mine) .chat-bubble {\n  border-color: rgba(99, 113, 132, 0.22);\n}\n.chat-sender-avatar {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  overflow: hidden;\n}\n.chat-sender-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.user-color-deleted {\n  background:\n    linear-gradient(\n      145deg,\n      #a7adb7,\n      #687180);\n}\n.user-color-system {\n  color: #fff;\n  border: 1px solid rgba(116, 226, 255, 0.72);\n  background:\n    radial-gradient(\n      circle at 30% 20%,\n      rgba(103, 232, 255, 0.96),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #3948c8 0%,\n      #8a3fc0 58%,\n      #e94791 100%);\n  box-shadow: 0 4px 12px rgba(67, 48, 163, 0.3);\n}\n.chat-sender-avatar.user-color-system .mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n  line-height: 19px;\n}\n.chat-message-content {\n  min-width: 0;\n}\n.chat-meta-row {\n  display: flex;\n  align-items: center;\n  gap: 0.35rem;\n  margin-bottom: 0.2rem;\n}\n.chat-sender-name {\n  font-size: 0.82rem;\n  font-weight: 800;\n  color: rgba(20, 32, 52, 0.92);\n  line-height: 1.2;\n}\n.chat-time-chip {\n  margin-left: auto;\n  min-width: 56px;\n  height: 18px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.08);\n  color: rgba(20, 32, 52, 0.58);\n  font-size: 0.66rem;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 7px;\n}\n.chat-line {\n  margin: 0;\n  max-width: min(340px, 100vw - 8rem);\n  color: rgba(16, 29, 49, 0.88);\n  font-size: 0.82rem;\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n.chat-line-link {\n  display: inline;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: #0b64c0;\n  font: inherit;\n  text-decoration: underline;\n  overflow-wrap: anywhere;\n  cursor: pointer;\n}\n.chat-attachment-stack {\n  display: grid;\n  gap: 0.34rem;\n  margin: 0.1rem 0 0.36rem;\n  width: 100%;\n}\n.chat-image-attachment {\n  margin: 0;\n  display: grid;\n  gap: 0.2rem;\n  width: auto;\n  max-width: min(360px, 100%);\n}\n.chat-image-attachment img {\n  display: block;\n  width: auto;\n  max-width: 100%;\n  max-height: clamp(180px, 38vw, 260px);\n  height: auto;\n  object-fit: contain;\n  border-radius: 10px;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  background: rgba(255, 255, 255, 0.7);\n  content-visibility: auto;\n  contain-intrinsic-size: 320px 210px;\n}\n.chat-image-attachment figcaption {\n  display: none;\n  max-width: 100%;\n  color: rgba(34, 50, 74, 0.6);\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-voice-attachment {\n  width: min(320px, 100%);\n  min-width: 240px;\n  max-width: 100%;\n  display: grid;\n  grid-template-columns: 34px minmax(0, 1fr);\n  gap: 0.46rem 0.62rem;\n  align-items: center;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.86);\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n  overflow: hidden;\n}\n.chat-voice-attachment-icon {\n  margin: 0.62rem 0 0 0.62rem;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: #c0139a;\n  color: #fff;\n}\n.chat-voice-attachment-icon .mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.chat-voice-attachment-copy {\n  margin: 0.62rem 0.62rem 0 0;\n  min-width: 0;\n  display: grid;\n  gap: 0.1rem;\n}\n.chat-voice-attachment-copy strong,\n.chat-voice-attachment-copy small,\n.chat-voice-attachment-missing {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-voice-attachment-copy strong {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.84rem;\n}\n.chat-voice-attachment-copy small,\n.chat-voice-attachment-missing {\n  color: rgba(32, 51, 78, 0.68);\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.chat-voice-attachment-player {\n  grid-column: 1/-1;\n  min-width: 190px;\n  max-width: 100%;\n  overflow: hidden;\n  border-radius: 0 0 9px 9px;\n}\n.chat-voice-attachment audio {\n  display: block;\n  width: 100%;\n  min-width: 190px;\n  max-width: 100%;\n  height: 34px;\n  border-radius: 0 0 9px 9px;\n  overflow: hidden;\n}\n.chat-poll-attachment {\n  width: 200px;\n  display: grid;\n  gap: 0.56rem;\n  padding: 0.54rem 0.54rem 0.68rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n}\n.chat-poll-attachment > strong {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.9rem;\n  line-height: 1.18;\n  text-align: center;\n}\n.chat-poll-options {\n  display: grid;\n  gap: 0.38rem;\n}\n.chat-poll-option {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0;\n  color: #22324a;\n  text-align: left;\n}\n.chat-poll-option-row {\n  min-width: 0;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.42rem;\n}\n.chat-poll-check {\n  width: 18px;\n  height: 18px;\n  border: 1px solid rgba(33, 54, 82, 0.45);\n  border-radius: 4px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n}\n.chat-poll-vote-option.is-selected .chat-poll-check {\n  border-color: #0b74de;\n  background: #0b74de;\n}\n.chat-poll-check .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.chat-poll-option-text {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 0.82rem;\n  font-weight: 750;\n}\n.chat-poll-voters {\n  min-width: 56px;\n  display: inline-flex;\n  justify-content: flex-end;\n}\n.chat-poll-voter-avatar {\n  width: 18px;\n  height: 18px;\n  margin-left: -5px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.52rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.chat-poll-bar {\n  height: 7px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.06);\n  overflow: hidden;\n}\n.chat-poll-bar span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: rgba(123, 92, 214, 0.44);\n}\n.chat-poll-vote-btn {\n  height: 32px;\n  width: fit-content;\n  justify-self: center;\n  padding: 0 1rem;\n  border: 0;\n  border-radius: 8px;\n  background: rgba(20, 32, 52, 0.06);\n  color: rgba(16, 29, 49, 0.92);\n  font-weight: 850;\n  cursor: pointer;\n}\n.chat-poll-vote-btn:not(:disabled) {\n  background: #0b74de;\n  color: #fff;\n}\n.chat-card-attachment {\n  width: 100%;\n  min-height: 112px;\n  display: flex;\n  align-items: stretch;\n  gap: 0.62rem;\n  padding: 0;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #22324a;\n  text-align: left;\n  cursor: inherit;\n  overflow: hidden;\n  box-shadow: 0 8px 20px rgba(24, 42, 68, 0.08);\n  -webkit-tap-highlight-color: transparent;\n}\n.chat-card-attachment-media {\n  flex: 0 0 116px;\n  min-height: 112px;\n  background: rgba(229, 236, 246, 0.78);\n}\n.chat-card-attachment-media img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  min-height: 112px;\n  object-fit: cover;\n}\n.chat-card-attachment-copy {\n  min-width: 0;\n  flex: 1 1 auto;\n  display: grid;\n  align-content: center;\n  gap: 0.2rem;\n  padding: 0.62rem 0.68rem 0.62rem 0;\n}\n.chat-card-attachment:not(:has(.chat-card-attachment-media)) .chat-card-attachment-copy {\n  padding-left: 0.68rem;\n}\n.chat-card-attachment-kicker {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  color: rgba(38, 56, 82, 0.62);\n  font-size: 0.68rem;\n  font-weight: 900;\n  text-transform: uppercase;\n}\n.chat-card-attachment-kicker .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.chat-card-attachment strong,\n.chat-card-attachment small,\n.chat-card-attachment-description {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.chat-card-attachment strong {\n  color: rgba(16, 29, 49, 0.94);\n  font-size: 0.84rem;\n  line-height: 1.18;\n  white-space: nowrap;\n}\n.chat-card-attachment small {\n  color: rgba(32, 51, 78, 0.68);\n  font-size: 0.74rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.chat-card-attachment-description {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  color: rgba(37, 52, 74, 0.72);\n  font-size: 0.74rem;\n  line-height: 1.25;\n}\n.chat-card-attachment-event {\n  border-color: rgba(54, 143, 92, 0.22);\n  background: rgba(242, 251, 246, 0.9);\n}\n.chat-card-attachment-event .chat-card-attachment-kicker {\n  color: #23643d;\n}\n.chat-card-attachment-asset {\n  border-color: rgba(77, 93, 116, 0.2);\n  background: rgba(247, 249, 252, 0.94);\n}\n.chat-card-attachment-asset .chat-card-attachment-kicker {\n  color: #35445a;\n}\n.chat-card-attachment-event,\n.chat-card-attachment-asset {\n  width: min(300px, 100%);\n  min-height: 0;\n  display: grid;\n  gap: 0;\n}\n.chat-card-attachment-event .chat-card-attachment-media,\n.chat-card-attachment-asset .chat-card-attachment-media {\n  width: 100%;\n  min-height: 0;\n  height: 116px;\n}\n.chat-card-attachment-event .chat-card-attachment-media img,\n.chat-card-attachment-asset .chat-card-attachment-media img {\n  min-height: 0;\n  height: 100%;\n}\n.chat-card-attachment-event .chat-card-attachment-copy,\n.chat-card-attachment-asset .chat-card-attachment-copy {\n  padding: 0.58rem 0.66rem 0.64rem;\n  align-content: start;\n}\n.chat-card-attachment-event:not(:has(.chat-card-attachment-media)) .chat-card-attachment-copy,\n.chat-card-attachment-asset:not(:has(.chat-card-attachment-media)) .chat-card-attachment-copy {\n  padding-left: 0.66rem;\n}\n.chat-card-attachment-link {\n  width: fit-content;\n  max-width: min(260px, 100%);\n  min-height: 0;\n  border-color: rgba(47, 103, 177, 0.22);\n  background: rgba(241, 247, 255, 0.94);\n}\n.chat-card-attachment-link .chat-card-attachment-copy {\n  padding: 0.58rem 0.66rem 0.64rem;\n  align-content: start;\n  flex: 0 0 auto;\n  width: max-content;\n  max-width: 100%;\n}\n.chat-card-attachment-link .chat-card-attachment-kicker {\n  color: #245b9f;\n}\n.chat-card-attachment-unavailable {\n  border-color: rgba(98, 111, 130, 0.22);\n  background: rgba(244, 247, 250, 0.78);\n  box-shadow: none;\n  filter: grayscale(0.35);\n}\n.chat-card-attachment-unavailable .chat-card-attachment-media img {\n  opacity: 0.52;\n}\n.chat-card-attachment-unavailable .chat-card-attachment-kicker,\n.chat-card-attachment-unavailable strong,\n.chat-card-attachment-unavailable small,\n.chat-card-attachment-unavailable .chat-card-attachment-description {\n  color: rgba(72, 84, 101, 0.72);\n}\n.chat-card-attachment-status {\n  color: rgba(73, 85, 103, 0.82);\n}\n.chat-message:last-child {\n  margin-bottom: 0.8rem;\n}\n.chat-thread-list--reverse .chat-message:first-child {\n  margin-bottom: 1.35rem;\n}\n.chat-thread-list--reverse .chat-message:last-child {\n  margin-bottom: 0.8rem;\n}\n.chat-message.chat-message-selected .chat-bubble {\n  box-shadow: 0 0 0 2px rgba(66, 110, 182, 0.18), 0 16px 34px rgba(24, 42, 68, 0.12);\n}\n.chat-message.chat-message-selected {\n  z-index: 25;\n}\n.chat-message.chat-message-highlighted .chat-bubble {\n  animation: chat-message-reply-highlight 0.72s ease-out;\n}\n.chat-message-reply-context {\n  position: relative;\n  z-index: 0;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 0.16rem;\n  max-width: min(360px, 76%);\n  margin: 0 0 -0.42rem 2.75rem;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: rgba(35, 54, 82, 0.66);\n  font-size: 0.76rem;\n  cursor: pointer;\n  -webkit-user-select: none;\n  user-select: none;\n  touch-action: manipulation;\n}\n.chat-message.mine .chat-message-reply-context {\n  align-items: flex-end;\n  margin-right: 0.62rem;\n  margin-left: 0;\n}\n.chat-message-reply-label {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  color: rgba(43, 61, 88, 0.82);\n  font-weight: 700;\n}\n.chat-message-reply-label .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.chat-message-reply-quote {\n  display: flex;\n  flex-direction: column;\n  gap: 0.14rem;\n  max-width: 100%;\n  min-width: 7.5rem;\n  padding: 0.44rem 0.78rem 0.56rem;\n  border: 1px solid rgba(33, 54, 82, 0.09);\n  border-radius: 16px;\n  background: rgba(238, 241, 245, 0.92);\n  color: rgba(35, 49, 70, 0.78);\n  box-shadow: 0 8px 18px rgba(20, 32, 52, 0.06);\n  font-weight: 650;\n  line-height: 1.25;\n  overflow: hidden;\n  text-align: left;\n}\n.chat-message.mine .chat-message-reply-quote {\n  background: rgba(238, 241, 245, 0.92);\n  margin-right: 0.42rem;\n}\n.chat-message.mine .chat-message-reply-quote--structured {\n  transform: translateX(-4.5rem);\n}\n.chat-message-reply-title,\n.chat-message-reply-meta {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.chat-message-reply-title {\n  font-weight: 800;\n}\n.chat-message-reply-meta {\n  color: rgba(45, 61, 84, 0.58);\n  font-size: 0.72rem;\n  font-weight: 650;\n}\n.chat-bubble {\n  z-index: 1;\n}\n.chat-line-deleted {\n  color: rgba(79, 92, 112, 0.78);\n  font-style: italic;\n}\n.chat-pin-badge {\n  position: absolute;\n  top: -0.6rem;\n  right: -0.15rem;\n  z-index: 4;\n  width: 18px;\n  height: 18px;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 50%;\n  background: #fff;\n  color: #345c91;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16);\n}\n.chat-pin-badge .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n}\n.chat-edited-label {\n  display: block;\n  margin-top: 0.16rem;\n  color: rgba(66, 82, 106, 0.58);\n  font-size: 0.68rem;\n}\n.chat-reaction-summary {\n  position: absolute;\n  left: 0.32rem;\n  bottom: -0.64rem;\n  z-index: 4;\n  display: inline-flex;\n  gap: 0.25rem;\n  padding: 0.12rem 0.34rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 999px;\n  background: #fff;\n  color: #263852;\n  font-size: 0.74rem;\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.14);\n}\n.chat-message.mine .chat-reaction-summary {\n  left: 0.32rem;\n  right: auto;\n}\n.chat-message-tools,\n.chat-quick-reactions {\n  position: absolute;\n  z-index: 35;\n  background: rgba(255, 255, 255, 0.98);\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  box-shadow: 0 18px 44px rgba(17, 24, 39, 0.16);\n}\n.chat-message-tools {\n  top: 0;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  display: inline-flex;\n  gap: 0.1rem;\n  padding: 0.18rem;\n  border-radius: 999px;\n}\n.chat-message-tools.chat-message-tools-down {\n  top: auto;\n  bottom: -1.08rem;\n  transform: translateX(-50%);\n}\n.chat-message.mine .chat-message-tools {\n  left: 50%;\n  right: auto;\n}\n.chat-message-tools button,\n.chat-quick-reactions > button {\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.chat-message-tools button {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  color: #446280;\n}\n.chat-message-tools button.chat-tool-btn-open {\n  background: #eef4ff;\n}\n.chat-message-tools .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n.chat-quick-reactions {\n  left: 50%;\n  bottom: calc(100% + 1.15rem);\n  transform: translateX(-50%);\n  display: inline-flex;\n  align-items: center;\n  gap: 0.12rem;\n  padding: 0.28rem;\n  border-radius: 999px;\n}\n.chat-quick-reactions.chat-quick-reactions-down {\n  top: 1.72rem;\n  bottom: auto;\n}\n.chat-quick-reactions.chat-quick-reactions-tools-down {\n  top: calc(100% + 1.25rem);\n  bottom: auto;\n}\n.chat-message.mine .chat-quick-reactions {\n  left: 50%;\n  right: auto;\n}\n.chat-quick-reactions > button {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  font-size: 1.06rem;\n}\n@media (hover: hover) and (pointer: fine) {\n  .chat-message-tools button:hover,\n  .chat-quick-reactions > button:hover {\n    background: #eef4ff;\n  }\n}\n.chat-message-action-trigger {\n  display: block;\n  width: 28px;\n  height: 28px;\n}\n:host ::ng-deep .chat-message-action-trigger .app-menu__trigger {\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n  border: 0;\n  background: transparent;\n  color: #446280;\n  box-shadow: none;\n}\n:host ::ng-deep .chat-message-action-trigger .app-menu__trigger--open {\n  background: #eef4ff;\n}\n:host ::ng-deep .chat-message-action-trigger .app-menu__trigger .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n@media (hover: none), (pointer: coarse) {\n  .chat-message-tools button:not(.chat-tool-btn-open):hover,\n  .chat-message-tools button:not(.chat-tool-btn-open):active,\n  .chat-message-tools button:not(.chat-tool-btn-open):focus {\n    background: transparent;\n    outline: none;\n  }\n  .chat-message-tools button.chat-tool-btn-open:hover,\n  .chat-message-tools button.chat-tool-btn-open:active,\n  .chat-message-tools button.chat-tool-btn-open:focus {\n    background: #eef4ff;\n    outline: none;\n  }\n}\n.chat-message.chat-message-fresh .chat-bubble {\n  animation: chat-message-pop 0.34s ease-out;\n}\n.chat-message.chat-message-pending .chat-bubble,\n.chat-message.chat-message-timed-out .chat-bubble {\n  isolation: isolate;\n}\n.chat-message.chat-message-pending .chat-bubble::before,\n.chat-message.chat-message-timed-out .chat-bubble::before,\n.chat-message.chat-message-pending .chat-bubble::after,\n.chat-message.chat-message-timed-out .chat-bubble::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  z-index: 0;\n  padding: 2px;\n  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  -webkit-mask-composite: xor;\n  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  mask-composite: exclude;\n}\n.chat-message.chat-message-pending .chat-bubble::before,\n.chat-message.chat-message-timed-out .chat-bubble::before {\n  background: rgba(133, 100, 42, 0.18);\n}\n.chat-message.chat-message-pending .chat-bubble::after {\n  --chat-progress-angle: 0deg;\n  background:\n    conic-gradient(\n      from 0deg,\n      rgb(235, 147, 33) 0deg,\n      rgb(247, 190, 52) var(--chat-progress-angle),\n      transparent var(--chat-progress-angle),\n      transparent 360deg);\n  animation: chat-message-border-progress var(--chat-pending-progress-duration) linear forwards;\n}\n.chat-message.chat-message-timed-out .chat-bubble::after {\n  background:\n    linear-gradient(\n      135deg,\n      rgb(213, 54, 68),\n      rgb(196, 29, 42));\n}\n.chat-message.chat-message-pending .chat-message-content,\n.chat-message.chat-message-pending .chat-sender-avatar {\n  opacity: 0.9;\n}\n.chat-message.chat-message-pending .chat-bubble > *,\n.chat-message.chat-message-timed-out .chat-bubble > * {\n  position: relative;\n  z-index: 1;\n}\n.chat-message.chat-message-pending .chat-bubble > .chat-reaction-summary,\n.chat-message.chat-message-timed-out .chat-bubble > .chat-reaction-summary {\n  position: absolute;\n  z-index: 4;\n}\n.chat-readers {\n  position: absolute;\n  right: 0.28rem;\n  bottom: -0.62rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.14rem;\n}\n.chat-reader {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  color: #fff;\n  font-size: 8px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);\n  overflow: hidden;\n}\n.chat-reader img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.chat-reader.chat-reader-fresh {\n  animation: chat-reader-pulse 0.44s ease-out;\n}\n.chat-typing-indicator {\n  min-height: 24px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  margin: -0.06rem 0 0.08rem;\n  padding: 0 0.18rem;\n  color: rgba(36, 64, 99, 0.78);\n  font-size: 0.74rem;\n  font-weight: 700;\n}\n.chat-typing-indicator-dots {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n}\n.chat-typing-indicator-dots span {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: rgba(46, 104, 159, 0.72);\n  animation: chat-typing-bounce 1s ease-in-out infinite;\n}\n.chat-typing-indicator-dots span:nth-child(2) {\n  animation-delay: 0.12s;\n}\n.chat-typing-indicator-dots span:nth-child(3) {\n  animation-delay: 0.24s;\n}\n.chat-compose-box {\n  position: relative;\n  z-index: 70;\n  background: #fff;\n  padding-top: 0.18rem;\n  margin-top: 0;\n  min-height: 42px;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.35rem;\n}\n.chat-composer-app-menu {\n  display: block;\n}\n.chat-voice-composer {\n  --chat-voice-control-size: 28px;\n  --chat-voice-control-gap: 0.46rem;\n  position: relative;\n  min-width: 0;\n  flex: 1 1 auto;\n  height: 38px;\n  min-height: 0;\n  box-sizing: border-box;\n  display: grid;\n  grid-template-columns: var(--chat-voice-control-size) minmax(0, 1fr) auto var(--chat-voice-control-size);\n  align-items: center;\n  gap: var(--chat-voice-control-gap);\n  padding: 0 0.22rem;\n  border: 1px solid rgba(192, 19, 154, 0.28);\n  border-radius: 999px;\n  background: #d100a7;\n  color: #fff;\n  line-height: 1;\n}\n.chat-voice-composer > * {\n  align-self: center;\n}\n.chat-voice-cancel-btn,\n.chat-voice-record-btn,\n.chat-voice-send-btn {\n  width: var(--chat-voice-control-size);\n  height: var(--chat-voice-control-size);\n  box-sizing: border-box;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 var(--chat-voice-control-size);\n  line-height: 0;\n  cursor: pointer;\n}\n.chat-voice-cancel-btn {\n  width: var(--chat-voice-control-size) !important;\n  min-width: var(--chat-voice-control-size) !important;\n  max-width: var(--chat-voice-control-size) !important;\n  height: var(--chat-voice-control-size) !important;\n  min-height: var(--chat-voice-control-size) !important;\n  max-height: var(--chat-voice-control-size) !important;\n  padding: 0 !important;\n  border: 0 !important;\n  border-color: transparent !important;\n  background: rgba(255, 255, 255, 0.2);\n  color: #fff;\n}\n.chat-voice-record-btn,\n.chat-voice-send-btn {\n  background: #fff;\n  color: #c0139a;\n}\n.chat-voice-record-btn.is-recording {\n  color: #d1002f;\n}\n.chat-voice-send-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.chat-voice-cancel-btn .mat-icon,\n.chat-voice-record-btn .mat-icon,\n.chat-voice-send-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.chat-voice-recorder-shell {\n  min-width: 0;\n  height: var(--chat-voice-control-size);\n  display: flex;\n  align-items: center;\n  gap: var(--chat-voice-control-gap);\n}\n.chat-voice-bars {\n  min-width: 0;\n  height: var(--chat-voice-control-size);\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n}\n.chat-voice-bars span {\n  width: 3px;\n  height: 12px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.78);\n}\n.chat-voice-bars span:nth-child(2),\n.chat-voice-bars span:nth-child(4) {\n  height: 16px;\n}\n.chat-voice-bars span:nth-child(3) {\n  height: 20px;\n}\n.chat-voice-bars.is-recording span {\n  animation: chat-voice-bar-pulse 0.82s ease-in-out infinite alternate;\n}\n.chat-voice-bars.is-recording span:nth-child(2) {\n  animation-delay: 0.08s;\n}\n.chat-voice-bars.is-recording span:nth-child(3) {\n  animation-delay: 0.16s;\n}\n.chat-voice-bars.is-recording span:nth-child(4) {\n  animation-delay: 0.24s;\n}\n.chat-voice-bars.is-recording span:nth-child(5) {\n  animation-delay: 0.32s;\n}\n.chat-voice-timer {\n  min-width: 42px;\n  height: var(--chat-voice-control-size);\n  box-sizing: border-box;\n  padding: 0 0.38rem;\n  border-radius: 999px;\n  background: #fff;\n  color: #c0139a;\n  font-size: 0.78rem;\n  line-height: 1;\n  font-weight: 900;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n.chat-voice-review-player {\n  width: 100%;\n  height: 28px;\n}\n.chat-voice-error {\n  position: absolute;\n  left: 0.75rem;\n  right: 0.75rem;\n  bottom: calc(100% + 0.22rem);\n  min-width: 0;\n  padding: 0.18rem 0.46rem;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.88);\n  color: #fff;\n  font-size: 0.7rem;\n  font-weight: 800;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  pointer-events: none;\n}\n.chat-poll-composer {\n  display: grid;\n  gap: 0.62rem;\n  padding: 0.85rem;\n}\n.chat-poll-composer-header {\n  display: block;\n}\n.chat-poll-composer input {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  height: 34px;\n  border: 0;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 0;\n  background: transparent;\n  color: #17243a;\n  font-size: 0.86rem;\n  font-weight: 750;\n  outline: none;\n}\n.chat-poll-composer-header > input {\n  text-align: center;\n}\n.chat-poll-composer-option button {\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(32, 51, 78, 0.58);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.chat-poll-composer-option .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-poll-composer-options {\n  display: grid;\n  gap: 0.2rem;\n}\n.chat-poll-composer-option {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 30px;\n  gap: 0.45rem;\n  align-items: center;\n}\n.chat-poll-composer-actions {\n  display: grid;\n  gap: 0.5rem;\n}\n.chat-poll-add-option-btn,\n.chat-poll-create-btn {\n  min-height: 34px;\n  border: 0;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  font-weight: 850;\n  cursor: pointer;\n}\n.chat-poll-add-option-btn {\n  justify-content: flex-start;\n  background: transparent;\n  color: rgba(32, 51, 78, 0.68);\n}\n.chat-poll-add-option-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-poll-create-btn {\n  background: #e8f2ff;\n  color: #0064d8;\n}\n.chat-poll-create-btn:disabled,\n.chat-poll-add-option-btn:disabled {\n  cursor: default;\n  opacity: 0.55;\n}\n@keyframes chat-voice-bar-pulse {\n  from {\n    transform: scaleY(0.55);\n    opacity: 0.72;\n  }\n  to {\n    transform: scaleY(1);\n    opacity: 1;\n  }\n}\n.chat-compose-plus-wrap {\n  position: relative;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  align-self: center;\n  display: inline-flex;\n}\n.chat-compose-plus-btn {\n  position: relative;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  padding: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(33, 54, 82, 0.2);\n  border-radius: 50%;\n  background: #fff;\n  color: #365a85;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  line-height: 1;\n  align-self: center;\n}\n.chat-compose-plus-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  display: block;\n}\n:host ::ng-deep .chat-composer-app-menu .app-menu__trigger {\n  width: 32px;\n  height: 32px;\n  min-width: 32px;\n  min-height: 32px;\n  padding: 0;\n  border-color: rgba(33, 54, 82, 0.2);\n  background: #fff;\n  color: #365a85;\n  box-shadow: none;\n}\n:host ::ng-deep .chat-composer-app-menu .app-menu__trigger .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.chat-attachment-input {\n  display: none;\n}\n.chat-ascii-emoji-panel {\n  position: absolute;\n  left: 2.4rem;\n  right: 2.5rem;\n  bottom: calc(100% + 0.36rem);\n  z-index: 48;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  padding: 0.32rem;\n  border: 1px solid rgba(33, 54, 82, 0.12);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 14px 34px rgba(17, 24, 39, 0.16);\n  overflow-x: auto;\n}\n.chat-ascii-emoji-panel button {\n  flex: 0 0 auto;\n  min-width: 62px;\n  height: 42px;\n  padding: 0.2rem 0.42rem;\n  border: 0;\n  border-radius: 8px;\n  background: #f3f7fc;\n  color: #20334e;\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  grid-template-rows: auto auto;\n  column-gap: 0.28rem;\n  align-items: center;\n  cursor: pointer;\n}\n.chat-ascii-emoji-panel button:hover,\n.chat-ascii-emoji-panel button:focus-visible {\n  background: #e8f2ff;\n  outline: none;\n}\n.chat-ascii-emoji-panel__emoji {\n  grid-row: 1/3;\n  font-size: 1.2rem;\n  line-height: 1;\n}\n.chat-ascii-emoji-panel__token,\n.chat-ascii-emoji-panel small {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-align: left;\n}\n.chat-ascii-emoji-panel__token {\n  font-size: 0.76rem;\n  font-weight: 900;\n}\n.chat-ascii-emoji-panel small {\n  color: rgba(47, 66, 94, 0.64);\n  font-size: 0.64rem;\n  font-weight: 750;\n}\n.chat-compose-box textarea {\n  flex: 1 1 auto;\n  width: auto;\n  min-width: 0;\n  height: 42px;\n  min-height: 42px;\n  max-height: 140px;\n  box-sizing: border-box;\n  border: 1px solid rgba(36, 63, 98, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  color: #1c3557;\n  font: inherit;\n  font-size: 0.84rem;\n  line-height: 1.4;\n  padding: 0.65rem 0.72rem;\n  resize: none;\n  overflow-y: auto;\n}\n.chat-reply-draft {\n  flex: 0 0 100%;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  margin-bottom: 0.24rem;\n  padding: 0.42rem 0.52rem;\n  border-radius: 10px;\n  background: #eef4ff;\n  color: #365a85;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.chat-reply-draft button {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n}\n.chat-reply-draft-copy {\n  min-width: 0;\n  display: grid;\n  gap: 0.12rem;\n}\n.chat-reply-draft-copy strong {\n  color: rgba(24, 38, 60, 0.92);\n  line-height: 1.15;\n}\n.chat-reply-draft-copy small {\n  color: rgba(47, 66, 94, 0.7);\n  font-size: 0.76rem;\n  font-weight: 600;\n  line-height: 1.25;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.chat-reply-draft button {\n  border: 0;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n}\n.chat-reply-draft .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.chat-compose-box textarea:focus {\n  outline: 2px solid rgba(66, 110, 182, 0.34);\n  outline-offset: 0;\n  border-color: rgba(66, 110, 182, 0.52);\n}\n.chat-send-btn {\n  position: static;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(33, 54, 82, 0.2);\n  background: #fff;\n  color: #365a85;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  align-self: center;\n}\n.chat-send-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.chat-send-btn:disabled {\n  opacity: 0.52;\n  cursor: default;\n}\n.chat-poll-vote-body {\n  display: grid;\n  gap: 0.72rem;\n  padding: 1.65rem 1.5rem 1.2rem;\n}\n.chat-poll-vote-body > strong {\n  color: rgba(16, 29, 49, 0.96);\n  font-size: 1.05rem;\n  line-height: 1.2;\n}\n.chat-poll-vote-options {\n  margin-top: 0.28rem;\n  display: grid;\n  gap: 0;\n}\n.chat-poll-vote-option {\n  min-height: 56px;\n  display: grid;\n  grid-template-columns: 22px minmax(0, 1fr);\n  align-items: center;\n  gap: 0.72rem;\n  padding: 0;\n  border: 0;\n  border-bottom: 1px solid rgba(33, 54, 82, 0.12);\n  background: transparent;\n  color: rgba(16, 29, 49, 0.96);\n  text-align: left;\n  font-size: 0.9rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.chat-poll-vote-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.85rem;\n  padding: 1.1rem 1rem 1rem;\n}\n.chat-reaction-tabs {\n  display: flex;\n  gap: 0.35rem;\n  padding: 0.8rem 1rem 0;\n}\n.chat-reaction-tabs button {\n  border: 0;\n  border-bottom: 3px solid transparent;\n  background: transparent;\n  color: #245b9f;\n  padding: 0.45rem 0.2rem;\n  font-weight: 800;\n  cursor: pointer;\n}\n.chat-reaction-tabs button.active {\n  border-bottom-color: #2f75ff;\n}\n.chat-reaction-list,\n.chat-pinned-list {\n  padding: 1rem;\n}\n.chat-pinned-list {\n  display: grid;\n  gap: 1rem;\n  max-height: min(62vh, 34rem);\n  overflow: auto;\n}\n.chat-reaction-row,\n.chat-pinned-row {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  padding: 0.55rem;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  color: #22324a;\n  text-align: left;\n}\n.chat-reaction-avatar {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-weight: 800;\n  font-size: 0.75rem;\n}\n.chat-reaction-row small,\n.chat-pinned-row small {\n  display: block;\n  margin-top: 0.12rem;\n  color: rgba(34, 50, 74, 0.62);\n}\n.chat-reaction-row-emoji {\n  margin-left: auto;\n  font-size: 1.35rem;\n}\n.chat-pinned-message {\n  position: relative;\n  width: 100%;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.48rem;\n  padding: 0.6rem 0.7rem 0.9rem;\n  border: 1px solid rgba(55, 97, 154, 0.32);\n  border-radius: 11px;\n  background: #e9f2ff;\n  color: rgba(16, 29, 49, 0.88);\n  text-align: left;\n  cursor: pointer;\n  box-shadow: 0 12px 26px rgba(24, 42, 68, 0.09);\n}\n.chat-pinned-message-content {\n  min-width: 0;\n  display: grid;\n  gap: 0.18rem;\n  flex: 1 1 auto;\n}\n.chat-pinned-message .chat-meta-row {\n  margin-bottom: 0;\n}\n.chat-pinned-attachment {\n  color: rgba(34, 50, 74, 0.62);\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.chat-pinned-image-preview {\n  display: block;\n  width: min(260px, 100%);\n  margin-top: 0.22rem;\n  border: 1px solid rgba(33, 54, 82, 0.14);\n  border-radius: 10px;\n  overflow: hidden;\n  background: rgba(255, 255, 255, 0.72);\n}\n.chat-pinned-image-preview img {\n  display: block;\n  width: 100%;\n  height: clamp(96px, 22vw, 150px);\n  object-fit: contain;\n}\n.chat-pinned-dialog-pin {\n  top: -0.48rem;\n  right: 0.32rem;\n}\n.chat-pinned-reaction-summary {\n  position: absolute;\n  left: 0.32rem;\n  bottom: -0.62rem;\n}\n.chat-pinned-readers {\n  right: 0.28rem;\n  bottom: -0.62rem;\n}\n@keyframes chat-message-pop {\n  0% {\n    transform: translateY(10px) scale(0.97);\n    opacity: 0.2;\n  }\n  100% {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes chat-reader-pulse {\n  0% {\n    transform: scale(0.7);\n    box-shadow: 0 0 0 0 rgba(46, 104, 159, 0.3);\n  }\n  70% {\n    transform: scale(1.12);\n    box-shadow: 0 0 0 10px rgba(46, 104, 159, 0);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);\n  }\n}\n@keyframes chat-message-border-progress {\n  0% {\n    --chat-progress-angle: 0deg;\n  }\n  100% {\n    --chat-progress-angle: 360deg;\n  }\n}\n@keyframes chat-message-reply-highlight {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(66, 110, 182, 0);\n  }\n  35% {\n    transform: scale(1.035);\n    box-shadow: 0 0 0 4px rgba(66, 110, 182, 0.18), 0 18px 38px rgba(24, 42, 68, 0.14);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 2px rgba(66, 110, 182, 0.18), 0 16px 34px rgba(24, 42, 68, 0.12);\n  }\n}\n@keyframes chat-typing-bounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.35;\n  }\n  40% {\n    transform: translateY(-3px);\n    opacity: 1;\n  }\n}\n@media (max-width: 760px) {\n  .chat-compose-box {\n    min-height: 40px;\n    padding-top: 0;\n  }\n  .chat-compose-box textarea {\n    height: 40px;\n    min-height: 40px;\n    border-radius: 10px;\n    padding-top: 0.58rem;\n    padding-bottom: 0.58rem;\n  }\n  .chat-popup-box {\n    height: 100%;\n    min-height: 0;\n    padding: 0.45rem;\n    gap: 0.34rem;\n  }\n  .chat-thread {\n    flex: 1;\n    max-height: none;\n  }\n  .chat-compose-box {\n    position: relative;\n    left: auto;\n    right: auto;\n    bottom: auto;\n    z-index: 70;\n    margin-top: 0;\n    padding: 0.45rem 0.45rem max(0.45rem, env(safe-area-inset-bottom, 0px));\n    background: #fff;\n    box-shadow: 0 -4px 14px rgba(15, 29, 47, 0.08);\n    transform: none;\n    will-change: auto;\n    backface-visibility: visible;\n  }\n  .chat-compose-box textarea {\n    resize: none;\n  }\n  .chat-bubble {\n    max-width: 78%;\n  }\n  .chat-card-attachment {\n    width: min(340px, 100%);\n  }\n  .chat-voice-attachment {\n    width: min(240px, 100%);\n    min-width: 190px;\n  }\n  .chat-voice-attachment-player,\n  .chat-voice-attachment audio {\n    min-width: 160px;\n  }\n  .chat-poll-attachment {\n    width: 200px;\n  }\n  .chat-message {\n    margin-bottom: 0.8rem;\n  }\n  .chat-thread-list--reverse .chat-message:first-child {\n    margin-bottom: 1.35rem;\n  }\n  .chat-thread-list--reverse .chat-message:last-child {\n    margin-bottom: 0.8rem;\n  }\n}\n/*# sourceMappingURL=event-chat-popup.component.css.map */\n'] }]
  }], () => [], { chatSession: [{
    type: Input
  }], chatHeader: [{
    type: Input
  }], closeHostedChat: [{
    type: Input
  }], chatThreadSmartList: [{
    type: ViewChild,
    args: ["chatThreadSmartList"]
  }], messageTextarea: [{
    type: ViewChild,
    args: ["messageTextarea"]
  }], imageAttachmentInput: [{
    type: ViewChild,
    args: ["imageAttachmentInput"]
  }], chatComposeBoxElement: [{
    type: ViewChild,
    args: ["chatComposeBox"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventChatPopupComponent, { className: "EventChatPopupComponent", filePath: "app/activity/components/event-chat-popup/event-chat-popup.component.ts", lineNumber: 230 });
})();
export {
  EventChatPopupComponent
};
//# sourceMappingURL=event-chat-popup.component-RRFJSTSC.js.map
