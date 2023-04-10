import { derived, get, writable } from "svelte/store";
import { account, type Account } from "./chainClient";
import { AlarmState, userAlarm, userAlarmState } from "./contractInterface";

export enum View {
  WELCOME,
  CONNECT_WALLET,

  NO_ALARM,
  CREATE_ALARM,
  JOIN_ALARM,

  WAITING_FOR_OTHER_PLAYER,
  ALARM_ACTIVE,
}

function MakeAppViewController() {
  const view = writable<View>(View.WELCOME);
  let inWelcomeMode = true;

  const initView = () => {
    const _account = get(account);
    const alarmState = get(userAlarmState);
    if (inWelcomeMode) return;
    if (!_account?.isConnected) return view.set(View.CONNECT_WALLET);
    if (alarmState === AlarmState.NO_ALARM) return view.set(View.NO_ALARM);
    if (alarmState === AlarmState.PENDING_START)
      return view.set(View.WAITING_FOR_OTHER_PLAYER);
    if (alarmState === AlarmState.ACTIVE) return view.set(View.ALARM_ACTIVE);
    view.set(null as any);
  };

  account.subscribe(() => initView());

  let lastAlarmState = AlarmState.UNKNOWN;
  userAlarmState.subscribe((value) => {
    if (value !== lastAlarmState) initView();
  });

  return {
    subscribe: view.subscribe,
    showBackButton: {},
    initView,
    changeTo: (newView: View) => {
      view.set(newView);
    },
    goBack: () => {
      if ([View.CREATE_ALARM, View.JOIN_ALARM].includes(get(view))) {
        initView();
      }
    },
    exitWelcome: () => {
      inWelcomeMode = false;
      initView();
    },
  };
}

export const view = MakeAppViewController();
export const showBackButton = derived(view, ($view) => {
  return [View.CREATE_ALARM, View.JOIN_ALARM].includes($view);
});
