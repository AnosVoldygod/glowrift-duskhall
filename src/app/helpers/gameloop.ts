import { LoggerTimer } from 'logger-timer';

import { autoTravelGameloop } from './gameloop-autotravel';
import { currencyGameloop } from './gameloop-currency';
import { exploreGameloop } from './gameloop-explore';
import { gameloopTimers } from './gameloop-timers';
import { townGameloop } from './gameloop-town';
import { travelGameloop } from './gameloop-travel';
import { debug } from './logging';
import { isSetup } from './setup';
import { localStorageSignal } from './signal';
import { isGameStateReady, updateGamestate } from './state-game';
import { getOption } from './state-options';

export const isGameloopPaused = localStorageSignal<boolean>('paused', false);

export function doGameloop(numTicks: number): void {
  if (!isSetup()) return;
  if (!isGameStateReady()) return;
  if (isGameloopPaused()) return;

  const timer = new LoggerTimer({
    dumpThreshold: 100,
    isActive: getOption('debugGameloopTimerUpdates'),
  });

  timer.startTimer('gameloop');

  timer.startTimer('gameloop-autotravel');
  autoTravelGameloop();
  timer.stopTimer('gameloop-autotravel');

  timer.startTimer('gameloop-currency');
  currencyGameloop(numTicks);
  timer.stopTimer('gameloop-currency');

  timer.startTimer('gameloop-town');
  townGameloop(numTicks);
  timer.stopTimer('gameloop-town');

  timer.startTimer('gameloop-travel');
  travelGameloop(numTicks);
  timer.stopTimer('gameloop-travel');

  timer.startTimer('gameloop-explore');
  exploreGameloop(numTicks);
  timer.stopTimer('gameloop-explore');

  timer.startTimer('gameloop-timers');
  gameloopTimers(numTicks);
  timer.stopTimer('gameloop-timers');

  timer.dumpTimers((timers) => debug('Gameloop:Timers', timers));

  updateGamestate((state) => {
    state.actionClock.numTicks += numTicks;
    return state;
  });
}
