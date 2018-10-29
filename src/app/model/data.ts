import {Collaborateur} from "./collaborateur";
import {Mission} from "./mission";
import {Prestation} from "./prestation";

export class Data {

    collaborateur?: Collaborateur = new Collaborateur();
    mission?: Mission = new Mission();
    prestation?: Prestation = new Prestation();
    numAtg?:NumAtg = new NumAtg();
    societeStt:SocieteStt = new SocieteStt();
    contactsStt:ContactsStt = new ContactsStt();
    dpt:Dpt= new Dpt();
    contrat: Contrat = new Contrat();
    pole:Pole= new Pole();
    domaine:Domaine = new Domaine();
    site:Site =  new Site();

}


/*export class Collab {

    id: any;
    trig_open: any;
    nom: any;
    prenom: any;
    tel_perso: any;
    tel_pro: any;
    mail_open: any;
    mail_sg: any;
    code_categorisation: any;
    top_statut: any;
    statut_Collab: any;
    version_Collab: any;
    societe_stt: any;
    pre_embauche: any;
    date_embauche: any;
    created_at: any;
    created_by: any;
    updated_at: any;
    updated_by: any;
}*/
/*
export class Mission {

    id: any;
    identifiantMission: any;
    identifiantPilote: any;
    dateDebutSg: any;
    dateA3Ans: any;
    derogation: any;
    statutMission: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
    localisation: any;
    commercialOpen: any;
}*/
/*
export class Prestation {
    id: any;
    idPrestation: any;
    idMission: any;
    contratDAppli: any;
    identifiantPilote: any;
    equipeDepartement: any;/!**!/
    equipePole: any;
    equipeDomaine: any;
    numeroAtg: any;
    dateDebutPrestation: any;
    dateFinPrestation: any;
    numeroPu: any;
    localisation: any;
    responsableDePole: any;
    donneurDOrdre: any;
    commercialOpen: any;
    versionPrestation: any;
    topAtg: any;
    statutMission: any;
    dateCreationPrestation: any;
    utilisateurCreation: any;
    dateMajPrestation: any;
    utilisateurMaj: any;
}*/

export class NumAtg {
    id: any = 0;
    numeroAtg: any = 0;
    contrat: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

export class SocieteStt {
    id: any;
    codeSocieteStt: any;
    libelleSocieteStt: any;
}

export class ContactsStt {

    id: any;
    codeStt: any;
    nomContact: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Contrat {

    id: any;
    contratAppli: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
    departement: any;
}

export class Dpt {

    id: any;
    codeDepartement: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Pole {

    id: any;
    codePole: any;
    responsableDePole: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Domaine {

    id: any;
    codeDomaine: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Site {
    id: any;


    codeSite: any;
    libelleSite: any;
    dateCreation: any;
    trigrammeCreation: any;
    dateMaj: any;
    trigrammeMaj: any;
}


export class Referentiel {
    id: any;
    // site: Site[];
    // domaine: Domaine[];
    // pole: Pole[];
    // dpt: Dpt[];
    // contrat: Contrat[];
    // contactStt: ContactsStt[];
    // societeStt: SocieteStt[];
    // numAtg: NumAtg[];
    prestation: Prestation[];
    // mission: Mission[];

}
