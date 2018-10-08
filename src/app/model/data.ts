export class Data {
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
}


export class Collab {

    trigramme: any;
    stt: any;
    archiverCollab: any;
    versionCollab: any;
    preEmbauche: any;
}

export class Mission {

    identifiantMission: any;
    identifiantPilote: any;
    dateDebutSg: any;
    dateA3Ans: any;
    derogation: any;
    statutMission: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
    localisation: any;
    commercialOpen: any;
}

export class Prestation {

    idPrestation: any;
    idMission: any;
    contratDAppli: any;
    identifiantPilote: any;
    equipeDepartement: any;
    equipePole: any;
    equipeDomaine: any;
    numeroAtg: any;
    dateDebutPrestation: any;
    dateFinPrestation: any;
    numeroPu: any;
    localisation: any;
    responsableDePôle: any;
    donneurDOrdre: any;
    commercialOpen: any;
    versionPrestation: any;
    topAtg: any;
    statutMission: any;
    dateCréationPrestation: any;
    utilisateurCréation: any;
    dateMajPrestation: any;
    utilisateurMaj: any;
}

export class NumAtg {

    numeroAtg: any;
    contrat: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class SocieteStt {

    codeSociétéStt: any;
    libelléSociétéStt: any;
}

export class ContactsStt {

    codeStt: any;
    nomContact: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Contrat {

    contratAppli: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
    département: any;
}

export class Dpt {

    codeDépartement: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Pole {

    codePole: any;
    responsableDePole: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Domaine {

    codeDomaine: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}

export class Site {

    codeSite: any;
    libelléSite: any;
    dateCréation: any;
    trigrammeCréation: any;
    dateMaj: any;
    trigrammeMaj: any;
}
