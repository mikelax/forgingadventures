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

export function skillLevel(level) {
  return skillLevels[level];
}

export function postingFrequency(freq) {
  return postingFrequencies[freq];
}
