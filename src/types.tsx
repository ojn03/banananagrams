export interface tileInfo  {
  letter: string;
  valid: {
    vertical: boolean;
    horizontal: boolean;
  };
};

export type position = {
  x: number;
  y: number;
};
