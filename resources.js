import { databases, Resource } from "harper";

const HighScoresTable = databases.yahtzee.HighScores;

export class HighScores extends HighScoresTable {
    static loadAsInstance = false;

    allowRead() {
        return true;
    }

    allowCreate() {
        return true;
    }

    async get(target) {
        return super.get(target);
    }

    async post(target, data) {
        const record = { ...data, createdAt: new Date().toISOString() };
        await super.post(target, record);
        return record;
    }
}