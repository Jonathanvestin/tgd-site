from pathlib import Path

# Corrections P1 ciblées. Le script refuse silencieusement de réécrire un fichier absent,
# et affiche chaque remplacement non trouvé pour permettre un contrôle avant commit.

def replace(path, old, new):
    p = Path(path)
    if not p.exists():
        print(f"ABSENT: {path}")
        return
    s = p.read_text(encoding="utf-8")
    if old not in s:
        print(f"NON TROUVE: {path}: {old[:80]!r}")
        return
    p.write_text(s.replace(old, new), encoding="utf-8")
    print(f"OK: {path}: {old[:60]!r}")

business_ref='"provider": {"@id": "https://www.thegentlemandriver.fr/#business"}'

cities = {
"convoyage-marseille.html": (
    "Intervenez-vous dans tout Marseille et l’Provence-Alpes-Côte d’Azur ?",
    "Intervenez-vous à Marseille et en Provence-Alpes-Côte d’Azur ?",
    "TGD intervient à Marseille, en petite couronne et en grande couronne. Les modalités sont étudiées selon les adresses, le véhicule, la date et la faisabilité de la mission.",
    "TGD étudie les missions au départ ou à destination de Marseille et de Provence-Alpes-Côte d’Azur selon le trajet, le véhicule, la date, les disponibilités et la faisabilité.",
    "Les missions sont étudiées à Marseille, en petite couronne et en grande couronne selon trajet, disponibilité et faisabilité.",
    "TGD étudie les missions au départ ou à destination de Marseille et de Provence-Alpes-Côte d’Azur selon le trajet, le véhicule, la date, les disponibilités et la faisabilité."
),
"convoyage-lille.html": (
    "Intervenez-vous dans tout Lille et l’Hauts-de-France ?",
    "Intervenez-vous à Lille et dans les Hauts-de-France ?",
    "TGD intervient à Lille, en petite couronne et en grande couronne. Les modalités sont étudiées selon les adresses, le véhicule, la date et la faisabilité de la mission.",
    "TGD étudie les missions au départ ou à destination de Lille et des Hauts-de-France selon le trajet, le véhicule, la date, les disponibilités et la faisabilité.",
    "Les missions sont étudiées à Lille, en petite couronne et en grande couronne selon trajet, disponibilité et faisabilité.",
    "TGD étudie les missions au départ ou à destination de Lille et des Hauts-de-France selon le trajet, le véhicule, la date, les disponibilités et la faisabilité."
),
"convoyage-nantes.html": (
    "Intervenez-vous dans tout Nantes et l’Pays de la Loire ?",
    "Intervenez-vous à Nantes et dans les Pays de la Loire ?",
    "TGD intervient à Nantes, en petite couronne et en grande couronne. Les modalités sont étudiées selon les adresses, le véhicule, la date et la faisabilité de la mission.",
    "TGD étudie les missions au départ ou à destination de Nantes et des Pays de la Loire selon le trajet, le véhicule, la date, les disponibilités et la faisabilité.",
    "Les missions sont étudiées à Nantes, en petite couronne et en grande couronne selon trajet, disponibilité et faisabilité.",
    "TGD étudie les missions au départ ou à destination de Nantes et des Pays de la Loire selon le trajet, le véhicule, la date, les disponibilités et la faisabilité."
),
"convoyage-strasbourg.html": (
    "Intervenez-vous dans tout Strasbourg et l’Grand Est ?",
    "Intervenez-vous à Strasbourg et dans le Grand Est ?",
    "TGD intervient à Strasbourg, en petite couronne et en grande couronne. Les modalités sont étudiées selon les adresses, le véhicule, la date et la faisabilité de la mission.",
    "TGD étudie les missions au départ ou à destination de Strasbourg et du Grand Est selon le trajet, le véhicule, la date, les disponibilités et la faisabilité.",
    "Les missions sont étudiées à Strasbourg, en petite couronne et en grande couronne selon trajet, disponibilité et faisabilité.",
    "TGD étudie les missions au départ ou à destination de Strasbourg et du Grand Est selon le trajet, le véhicule, la date, les disponibilités et la faisabilité."
),
"convoyage-montpellier.html": (
    "Intervenez-vous dans tout Montpellier et l’Occitanie ?",
    "Intervenez-vous à Montpellier et en Occitanie ?",
    "TGD intervient à Montpellier, en petite couronne et en grande couronne. Les modalités sont étudiées selon les adresses, le véhicule, la date et la faisabilité de la mission.",
    "TGD étudie les missions au départ ou à destination de Montpellier et de l’Occitanie selon le trajet, le véhicule, la date, les disponibilités et la faisabilité.",
    "Les missions sont étudiées à Montpellier, en petite couronne et en grande couronne selon trajet, disponibilité et faisabilité.",
    "TGD étudie les missions au départ ou à destination de Montpellier et de l’Occitanie selon le trajet, le véhicule, la date, les disponibilités et la faisabilité."
),
}

for path, vals in cities.items():
    qold,qnew,aold,anew,vold,vnew=vals
    replace(path,qold,qnew); replace(path,aold,anew); replace(path,vold,vnew)

# Marseille : paragraphe local et lien obsolète.
replace("convoyage-marseille.html",
"TGD est basé à Charenton-le-Pont et étudie les départs et arrivées à Marseille intra-muros, en petite couronne et en grande couronne selon la mission.",
"TGD est basé à Charenton-le-Pont et étudie les départs et arrivées à Marseille et en Provence-Alpes-Côte d’Azur selon la mission.")
replace("convoyage-marseille.html", 'href="/entreprises">Solutions entreprises', 'href="/solutions-professionnelles">Solutions entreprises')

# Nice : grammaire + auto-référence de route.
replace("convoyage-nice.html","Intervenez-vous dans tout Nice et l’Alpes-Maritimes ?","Intervenez-vous à Nice et dans les Alpes-Maritimes ?")
replace("convoyage-nice.html","Pouvez-vous organiser une mission Nice ↔ Marseille, Lyon, Nice ou Europe ?","Pouvez-vous organiser une mission Nice ↔ Marseille, Lyon, autre région ou Europe ?")

# Toulouse : supprimer les promesses fermes connues.
replace("convoyage-toulouse.html","Intervention sous 24 à 48 h.","Missions étudiées sur devis selon le trajet, le véhicule, la date et les disponibilités.")
replace("convoyage-toulouse.html","Délai standard de 24 à 48h après confirmation.","Le délai dépend du trajet, du véhicule, de la date et des disponibilités. Il est précisé avant confirmation de la mission.")
replace("convoyage-toulouse.html","Devis 2h — 7j/7","Devis sur demande · selon disponibilité")

# Luxe : retirer les formulations absolues.
for old,new in [
("discrétion garantie","prise en charge confidentielle"),
("Discrétion garantie","Confidentialité"),
("discrétion absolue","prise en charge confidentielle"),
("Discrétion absolue","Prise en charge confidentielle"),
("Discrétion totale","Confidentialité")]:
    replace("convoyage-luxe.html",old,new)

# Fleet : éviter toute affiliation implicite avec des sociétés de leasing nommées.
replace("tgd-fleet.html",
"TGD connaît les environnements concessionnaires et loueurs, notamment Ayvens, Arval, Alphabet, Athlon, BNP Paribas Leasing Solutions et d’autres acteurs majeurs du leasing et de la gestion de flotte.",
"TGD connaît les environnements concessionnaires, loueurs, sociétés de leasing et gestionnaires de flotte, ainsi que leurs contraintes de restitution, de transfert et de traçabilité.")

# Centralisation des références d'entité quand les motifs connus sont présents.
for path in ["convoyage-marseille.html","convoyage-lille.html","convoyage-nantes.html","convoyage-strasbourg.html","convoyage-montpellier.html","convoyage-nice.html","convoyage-toulouse.html","convoyage-lyon.html","convoyage-luxe.html"]:
    p=Path(path)
    if not p.exists(): continue
    s=p.read_text(encoding="utf-8")
    import re
    ns,n=re.subn(r'"provider"\s*:\s*\{\s*"@type"\s*:\s*"LocalBusiness".*?\}\s*,\s*"description"', business_ref+',\n      "description"', s, count=1, flags=re.S)
    if n:
        p.write_text(ns,encoding="utf-8"); print(f"OK provider: {path}")

for path in ["tgd-fleet.html","tgd-automotive.html","tgd-digital.html"]:
    p=Path(path)
    if not p.exists(): continue
    s=p.read_text(encoding="utf-8")
    s2=s.replace('"@id":"https://www.thegentlemandriver.fr/#organization"','"@id":"https://www.thegentlemandriver.fr/#business"')
    s2=s2.replace('"@id": "https://www.thegentlemandriver.fr/#organization"','"@id": "https://www.thegentlemandriver.fr/#business"')
    if s2!=s:
        p.write_text(s2,encoding="utf-8"); print(f"OK entity ref: {path}")

# Sitemap : dates uniquement pour les pages P1 effectivement ciblées.
p=Path("sitemap.xml")
if p.exists():
    s=p.read_text(encoding="utf-8")
    slugs=["tgd-fleet","tgd-automotive","tgd-digital","convoyage-luxe","convoyage-lyon","convoyage-marseille","convoyage-lille","convoyage-nice","convoyage-toulouse","convoyage-nantes","convoyage-strasbourg","convoyage-montpellier"]
    import re
    for slug in slugs:
        s=re.sub(rf'(<loc>https://www\.thegentlemandriver\.fr/{re.escape(slug)}</loc><lastmod>)[^<]+',rf'\g<1>2026-09-17',s)
    p.write_text(s,encoding="utf-8"); print("OK: sitemap.xml")

print("\nTerminé. Contrôler maintenant git diff --check et les motifs résiduels avant commit.")
