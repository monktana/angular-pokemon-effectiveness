export abstract class PersistentScoreService {
  abstract read(): number;

  abstract save(): void;
}
