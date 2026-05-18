export type QuestionType = 'yesno' | 'single' | 'multiple';

export class Option {
  id: string;
  text: string;
  votes: number;
  constructor(text: string) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.votes = 0;
  }
  addVote(): void {
    this.votes++;
  }
  getPercentage(totalVotes: number): number {
    if (totalVotes === 0) return 0;
    return (this.votes / totalVotes) * 100;
  }
}

export class Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  constructor(text: string, type: QuestionType, optionsText?: string[]) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.type = type;
    if (type === 'yesno') {
      this.options = [new Option('Да'), new Option('Нет')];
    } else {
      this.options = (optionsText || []).map(t => new Option(t));
    }
  }
  addVote(optionId: string): boolean {
    const opt = this.options.find(o => o.id === optionId);
    if (opt) {
      opt.addVote();
      return true;
    }
    return false;
  }
  totalVotes(): number {
    return this.options.reduce((sum, opt) => sum + opt.votes, 0);
  }
}

export class Poll {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  imageUrl: string;
  constructor(title: string, description: string, questionsData: { text: string; type: QuestionType; options?: string[] }[], imageUrl?: string) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.createdAt = new Date();
    this.questions = questionsData.map(q => new Question(q.text, q.type, q.options));
    this.imageUrl = imageUrl || 'https://picsum.photos/id/1/300/200';
  }
}