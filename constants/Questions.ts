export type ICheckinQuestion = ICheckinSlider | ICheckinText;

export interface ICheckinSlider {
  title: string;
  key: string;
  active: boolean;
  minValue: number;
  maxValue: number;
  step: number;
}

export interface ICheckinText {
  title: string;
  key: string;
  active: boolean;
  placeholder?: string;
}

export const DefaultQuestions: ReadonlyArray<ICheckinQuestion> = [
  {
    title: 'How many hours of sleep did you get?',
    key: 'sleep',
    active: true,
    minValue: 0,
    maxValue: 12,
    step: 1,
  },
  {
    title: 'How good is your mood today?',
    key: 'mood',
    active: true,
    minValue: 1,
    maxValue: 10,
    step: 1,
  },
  {
    title: 'How many minutes of exercise did you get yesterday?',
    key: 'exercise',
    active: true,
    minValue: 0,
    maxValue: 180,
    step: 15,
  },
  {
    title: 'What\'s on your mind today?',
    key: 'journal',
    active: true,
  },
];

export enum CheckinType {
  slider = 'slider',
  text = 'text',
}

export const getCheckinType = (checkinQuestion: ICheckinQuestion): CheckinType => {
  if ('step' in checkinQuestion) {
    return CheckinType.slider;
  }
  return CheckinType.text;
}
