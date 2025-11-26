import { tables, Resource } from 'harperdb';

const HighScoresTable = tables.HighScores;
const UserTable = tables.User;
const UserStatsTable = tables.UserStats;
const UserAchievementTable = tables.UserAchievement;

export class HighScores extends Resource {
  static loadAsInstance = false;

  async get(target) {
    return super.get(target);
  }

  async post(target, data) {
    if (!data || !data.username || !data.email) {
      return {
        statusCode: 400,
        message: 'username and email are required to create a user',
      };
    }
    const record = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    return super.post(target, record);
  }
}

export class Users extends Resource {
  static loadAsInstance = false;

  async get(target) {
    return super.get(target);
  }

  async post(target, data) {
    const record = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    return super.post(target, record);
  }

  async delete(target) {
    const userId = target.id;
    if (!userId) {
      return {
        statusCode: 400,
        message: 'User id is required to delete a user',
      };
    }

    const statsQuery = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
      ],
    };

    for await (const stats of UserStatsTable.search(statsQuery)) {
      if (stats && stats.id) await UserStatsTable.delete(stats.id);
    }

    const achievementsQuery = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
      ],
    };

    for await (const ach of UserAchievementTable.search(achievementsQuery)) {
      if (ach && ach.id) await UserAchievementTable.delete(ach.id);
    }

    const scoresQuery = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
      ],
    };

    for await (const score of HighScoresTable.search(scoresQuery)) {
      if (score && score.id) await HighScoresTable.delete(score.id);
    }

    await super.delete(target);

    return {
      statusCode: 204,
      message: `User ${userId} and related data deleted`,
    };
  }
}

export class UserStats extends Resource {
  static loadAsInstance = false;

  async get(target) {
    return super.get(target);
  }

  async post(target, data) {
    const { userId } = data || {};
    if (!userId) {
      return {
        statusCode: 400,
        message: 'userId is required on UserStats',
      };
    }

    const query = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
      ],
      limit: 1,
    };

    let existing = null;
    const iterator = UserStatsTable.search(query);
    const { value: row } = await iterator.next();
    if (row) {
      existing = row;
    }

    const now = new Date().toISOString();
    let record;

    if (existing && existing.id) {
      record = { ...existing, ...data, lastUpdated: now };
      await super.put({ id: existing.id }, record);
    } else {
      record = { ...data, lastUpdated: now };
      record = await super.post(target, record);
    }

    return record;
  }
}

export class UserAchievements extends Resource {
  static loadAsInstance = false;

  async get(target) {
    return super.get(target);
  }

  async post(target, data) {
    const { userId, achievementId } = data || {};

    if (!userId || !achievementId) {
      return {
        statusCode: 400,
        message: 'userId and achievementId are required',
      };
    }

    const query = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
        { attribute: 'achievementId', comparator: 'eq', value: achievementId },
      ],
      limit: 1,
    };

    let existing = null;
    const iterator = UserAchievementTable.search(query);
    const { value: row } = await iterator.next();
    if (row) {
      existing = row;
    }

    let record;
    if (existing && existing.id) {
      record = { ...existing, ...data };
      await super.put({ id: existing.id }, record);
    } else {
      record = await super.post(target, {
        unlocked: false,
        progress: 0,
        ...data,
      });
    }

    return record;
  }
}

export class UnlockAchievement extends Resource {
  static loadAsInstance = false;

  async post(target, data) {
    const { userId, achievementId } = data || {};
    if (!userId || !achievementId) {
      return {
        statusCode: 400,
        message: 'userId and achievementId are required',
      };
    }

    const query = {
      conditions: [
        { attribute: 'userId', comparator: 'eq', value: userId },
        { attribute: 'achievementId', comparator: 'eq', value: achievementId },
      ],
      limit: 1,
    };

    let existing = null;
    for await (const row of UserAchievementTable.search(query)) {
      existing = row;
      break;
    }

    const now = new Date().toISOString();
    let record;

    if (existing && existing.id) {
      record = { ...existing, unlocked: true, unlockedAt: now };
      await UserAchievementTable.put({ id: existing.id }, record);
    } else {
      record = {
        userId,
        achievementId,
        unlocked: true,
        unlockedAt: now,
        progress: 0,
      };
      record = await UserAchievementTable.post({}, record);
    }

    return record;
  }
}

export class UserProfile extends Resource {
  static loadAsInstance = false;

  async get(target) {
    const userId = target.id;
    if (!userId) {
      return {
        statusCode: 400,
        message: 'User id is required',
      };
    }

    const query = {
      select: [
        'id',
        'username',
        'email',
        { name: 'stats', select: '*' },
        { name: 'achievements', select: '*' },
        { name: 'highScores', select: '*' },
      ],
      conditions: [
        { attribute: 'id', comparator: 'eq', value: userId },
      ],
      limit: 1,
    };

    let user = null;
    for await (const u of UserTable.search(query)) {
      user = u;
    }

    if (!user) {
      return {
        statusCode: 404,
        message: `User ${userId} not found`,
      };
    }

    return {
      statusCode: 200,
      body: user,
    };
  }
}
