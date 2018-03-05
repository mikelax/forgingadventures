export const skillLevels = {
  1: 'Any/Newbie friendly',
  2: 'I’ve rolled dice before',
  3: 'Expert/role play master and rules bookworm'
};

export const postingFrequencies = {
  1: 'About 1 / day',
  2: '2-3 times / week',
  3: 'Hardcore - More than 1 / day'
};

export const gameStatuses = {
  1: 'Recruiting Players',
  2: 'In Progress',
  3: 'Adding Additional Players',
  4: 'Completed'
};

export function skillLevel(level) {
  return skillLevels[level];
}

export function postingFrequency(freq) {
  return postingFrequencies[freq];
}

export function gameStatus(status) {
  return gameStatuses[status];
}
