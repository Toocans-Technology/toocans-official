export interface Country {
    countryEnName?: string;
    countryName?: string;
    created?: number;
    customOrder?: string;
    domainShortName?: string;
    id?: number;
    nationalCode?: string;
    status?: number;
  }
  
  export interface Response {
    code?: number;
    data?: Country[];
    msg?: string;
  }
  
  export interface LoginType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
  }