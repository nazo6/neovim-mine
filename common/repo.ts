export type RepoBasicInfo = {
  url: string;
  domain: string;
  owner: string;
  name: string;
  category: {
    name: string;
    level: number;
  }[][];
};

export type RepoAdvancedInfo = RepoBasicInfo & {
  data: {
    createdAt: string;
    star: number;
    lastCommit: string;
    commitCountLastYear: number;
    description: string;
    topics: string[];
    isArchived: boolean;
    primaryLanguage: {
      color?: string;
      name: string;
    };
  };
};

export type RepoErrorInfo = RepoBasicInfo & {
  error: {
    reason:
      | "UNSUPPORTED_DOMAIN"
      | "NOT_FOUND"
      | "UNKNOWN_ERROR";
    message?: string;
  };
};
