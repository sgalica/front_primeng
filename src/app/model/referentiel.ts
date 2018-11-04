import {Collaborateur} from "./collaborateur";
import {Mission} from "./mission";
import {Prestation} from "./prestation";

export class Referentiel {

    id: any;
    collaborateur: Collaborateur = new Collaborateur();
    mission: Mission = new Mission();
    prestation: Prestation = new Prestation();
    numAtg: NumAtg = new NumAtg();
    societeStt: SocieteStt = new SocieteStt();
    contactsStt: ContactsStt = new ContactsStt();
    dpt: Departement = new Departement();
    contrat: Contrat = new Contrat();
    pole: Pole = new Pole();
    domaine: Domaine = new Domaine();
    site: Site = new Site();

}


/*export class Collab {

    id: any = 0;
    trig_open: any = 0;
    nom: any = 0;
    prenom: any = 0;
    tel_perso: any = 0;
    tel_pro: any = 0;
    mail_open: any = 0;
    mail_sg: any = 0;
    code_categorisation: any = 0;
    top_statut: any = 0;
    statut_Collab: any = 0;
    version_Collab: any = 0;
    societe_stt: any = 0;
    pre_embauche: any = 0;
    date_embauche: any = 0;
    created_at: any = 0;
    created_by: any = 0;
    updated_at: any = 0;
    updated_by: any = 0;
}*/
/*
export class Mission {

    id: any = 0;
    identifiantMission: any = 0;
    identifiantPilote: any = 0;
    dateDebutSg: any = 0;
    dateA3Ans: any = 0;
    derogation: any = 0;
    statutMission: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
    localisation: any = 0;
    commercialOpen: any = 0;
}*/

/*
export class Prestation {
    id: any = 0;
    idPrestation: any = 0;
    idMission: any = 0;
    contratDAppli: any = 0;
    identifiantPilote: any = 0;
    equipeDepartement: any = 0;/!**!/
    equipePole: any = 0;
    equipeDomaine: any = 0;
    numeroAtg: any = 0;
    dateDebutPrestation: any = 0;
    dateFinPrestation: any = 0;
    numeroPu: any = 0;
    localisation: any = 0;
    responsableDePole: any = 0;
    donneurDOrdre: any = 0;
    commercialOpen: any = 0;
    versionPrestation: any = 0;
    topAtg: any = 0;
    statutMission: any = 0;
    dateCreationPrestation: any = 0;
    utilisateurCreation: any = 0;
    dateMajPrestation: any = 0;
    utilisateurMaj: any = 0;
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
    id: any = 0;
    codeSocieteStt: any = 0;
    libelleSocieteStt: any = 0;
}

export class ContactsStt {

    id: any = 0;
    codeContact: any = 0;
    codeStt: any = 0;
    nomContact: any = 0;
    adresseMail: any = 0;
    telephonePortable: any = 0;
    telephoneFixe: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

export class Contrat {

    id: any = 0;
    contratAppli: any = 0;
    debutContrat: any = 0;
    finContrat: any = 0;

    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
    departement: any = 0;
}

export class Departement {

    id: any = 0;
    codeDepartement: any = 0;
    topETeamETech: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

export class Pole {

    id: any = 0;
    codePole: any = 0;
    codeDepartement: any = 0;
    responsableDePole: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

export class Domaine {

    id: any = 0;
    codeDomaine: any = 0;
    codePoleParent: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

export class Site {
    id: any = 0;
    codeSite: any = 0;
    libelleSite: any = 0;
    dateCreation: any = 0;
    trigrammeCreation: any = 0;
    dateMaj: any = 0;
    trigrammeMaj: any = 0;
}

