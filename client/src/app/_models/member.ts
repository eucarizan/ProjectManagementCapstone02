import { Project } from "./projects";

export interface Member {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    gender: string;
    projectRole?: string;
    age: number;
    city: string;
    country: string;
    dateOfBirth: Date;
    created: Date;
    region: string;
    status: string;
    lastActive: Date;
    projects: Project[];
}

/*
"id": 1,
"username": "carla",
"firstName": "Carla",
"lastName": "Holly",
"email": "florariggs@terragen.com",
"mobile": "(940) 576-2191",
"gender": "female",
"projectRole": null,
"age": 54,
"city": "Muir",
"country": "Liechtenstein",
"created": "2019-09-25T00:00:00",
"lastActive": "2020-06-15T00:00:00",
"projects": [],
"birthday": "0001-01-01T00:00:00"
*/