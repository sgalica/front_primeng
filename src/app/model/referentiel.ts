export class AtgModel {

    id: any;
    collaborateur: Collaborateur = new Collaborateur();
    mission: Mission = new Mission();
    prestation: Prestation = new Prestation();
    numAtg: NumAtg = new NumAtg();
    societeStt: SocieteStt = new SocieteStt();
    contactsStt: ContactsStt = new ContactsStt();
    contrat: Contrat = new Contrat();
    site: Site = new Site();
    equipe :Equipe = new Equipe();
    donneurOrdre : DonneurOrdre = new DonneurOrdre();
    commercialOpen : CommercialOpen = new CommercialOpen();
    categorie : Categorie = new Categorie();

}


export class Referentiel {

    id: any =0;
    collaborateurs: Collaborateur [] ;
    missions: Mission [];
    prestations: Prestation[];
    numAtgs: NumAtg[];
    societeStts: SocieteStt[];
    contactsStts: ContactsStt[];
    contrats: Contrat[];
    sites: Site[];
    equipes :Equipe[];
    donneurOrdres : DonneurOrdre[];
    commercialOpens : CommercialOpen[];
    categories : Categorie[];

}

export class Collaborateur {
    id: any = 0;
    trigramme: any = 0;
    nom: any = 0;
    prenom: any = 0;
    telPerso: any = 0;
    telPro: any = 0;
    mailOpen: any = 0;
    mailSg: any = 0;
    categorisation: any = 0;
    stt: any = 0;
    statutCollab: any = 0;
    versionCollab: any = 0;
    societeStt: any = 0;
    preEmbauche: any = 0;
    dateEmbaucheOpen: any = 0;

    prestations: Prestation[];

    missions: Mission[];

     createdAt           : any = 0;
     createdBy           : any = 0;
     updatedAt           : any = 0;
     updatedBy           : any = 0;
}

export class Mission {
    id: any = 0;
    identifiantMission: any = 0;
    identifiantPilote: any = 0;
    dateDebutMission: any = 0;
    dateFinSg: any = 0;
    dateA3Ans: any = 0;
    derogation: any = 0;
    statutMission: any = 0;
    versionMission: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;

}

export class Prestation {

    id: any = 0;
    identifiantPrestation: any = 0;
    identifiantMission: any = 0;
    contratAppli: any = 0;
    trigramme: any = 0;
    departement: any = 0;
    pole: any = 0;
    domaine: any = 0;
    numAtg: any = 0;
    dateDebutPrestation: any = 0;
    dateFinPrestation: any = 0;
    numeroPu: any = 0;
    localisation: any = 0;
    responsablePole: any = 0;
    donneurOrdre: any = 0;
    commercialOpen: any = 0;
    topAtg: any = 0;
    statutPrestation: any = 0;
    versionPrestation: any = 0;

    collaborateur: Collaborateur;
    contrat : Contrat;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;

    dateDebutPrestationTri: any = 0;
    dateFinPrestationTri: any = 0;
    
}

export class NumAtg {
    id: any = 0;
    numeroAtg: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class SocieteStt {
    id: any = 0;
    codeSocieteStt: any = 0;
    libelleSocieteStt: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class Categorie {
    id: any = 0;
    categorisation: any = 0;
    libelle: any = 0;
    tarifProvince: any = 0;
    tarifIdf: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class ContactsStt {

    id: any = 0;
    cleContactStt: any = 0;
    codeStt: any = 0;
    nomContact: any = 0;
    adresseMail: any = 0;
    telephonePortable: any = 0;
    telephoneFixe: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class Contrat {

    id: any = 0;
    contratAppli: any = 0;
    dateDebutContrat: any = 0;
    dateFinContrat: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class Site {
    id: any = 0;
    codeSite: any = 0;
    libelleSite: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class Equipe {
    id: any = 0;
    cleEquipe: any = 0;
    departement: any = 0;
    pole: any = 0;
    domaine: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class DonneurOrdre {
    id: any = 0;
    cleDo: any = 0;
    donneurOrdre: any = 0;
    adresseMail: any = 0;
    telephonePortable: any = 0;
    telephoneFixe: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

export class CommercialOpen {
    id: any = 0;
    cleCommercialOpen: any = 0;
    commercialOpen: any = 0;
    adresseMail: any = 0;
    telephonePortable: any = 0;
    telephoneFixe: any = 0;

    createdAt           : any = 0;
    createdBy           : any = 0;
    updatedAt           : any = 0;
    updatedBy           : any = 0;
}

