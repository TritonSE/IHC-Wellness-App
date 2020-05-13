export interface ICheckinQuestion {
  title: string;
  key: string;
  active: boolean;
  type: 'slider' | 'text';
}

export const DefaultQuestions: ReadonlyArray<ICheckinQuestion> = [
  {
    title: 'How is your mood today?',
    key: 'mood',
    active: true,
    type: 'slider',
  },
];
