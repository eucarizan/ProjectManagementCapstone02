export interface ProjectAdd {
    projectName: string;
    startDate: Date;
    endDate: Date;
    projectDescription: string;
    managerId: number;
    clientName: string;
    budget: number;
    expenditure: number;
    teamSize: number;
    isActive: boolean;
}