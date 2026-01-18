export enum Brand {
  MERCEDES = 'MERCEDES',
  TESLA = 'TESLA'
}

export interface SectionData {
  id: string;
  mercTitle: string;
  mercBody: string;
  teslaTitle: string;
  teslaBody: string;
  year?: string;
}
