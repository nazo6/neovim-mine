export type RepoBasicInfo = {
  url: string;
  domain: string;
  owner: string;
  name: string;
  category: {
    source: string;
    file: string;
    data: {
      name: string;
      level: number;
    }[];
  }[];
};

export type RepoAdvancedInfo = RepoBasicInfo & {
  data: {
    createdAt: string;
    star: number;
    lastCommit: string;
    commitCountLastYear: number;
    description?: string;
    topics: string[];
    isArchived: boolean;
    nameWithOwner: string;
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

export type RepoInfo = RepoBasicInfo | RepoAdvancedInfo | RepoErrorInfo;
