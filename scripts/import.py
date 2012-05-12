import datastore.client
import csv, os

#Define elasticsearch database
url = "http://localhost:9200/esfera/camarasp/"
client = datastore.client.DataStoreClient(url)

encoding = 'iso-8859-1'
def parse(fp):
    os.system("iconv -f "+ encoding + " -t utf-8 " + fp + " --output utf8-" + fp)
    fo = open("utf8-"+fp, 'rU')
    arquivo = csv.DictReader(fo, delimiter='#')
    parsed = []
    for linha in arquivo:
        parsed.append(linha)
    return parsed

os.chdir('raw')
projetos = parse('projetos.txt')
print 'Loaded projetos...'
autores = parse('autor.txt')
print 'Loaded autores...'
assuntos = parse('assunto.txt')
print 'Loaded assuntos...'
os.chdir('..')

def funkystuff(reader):
    for p in reader:
        projeto = p
        projeto['id'] = p['TipoProj'] + '-' + p['NoProj'] + '-' + p['DataProj']
        projeto['autores'] = []
        projeto['assuntos'] = []
        for a in autores:
            if projeto['id'] == a['TipoProj'] + '-' + a['NoProj'] + '-' + a['DataProj']:
                projeto['autores'].append(a['Autor'])
        for a in assuntos:
            if projeto['id'] == str(a['TipoProj']) + '-' + str(a['NoProj']) + '-' + str(a['DataProj']):
                projeto['assuntos'].append(a['Assunto'])
        yield projeto




#client.delete()
#print "Delete done"

client.mapping_update(
{ "properties" :
    {
        "autores" : { "type" : "string", "analyzer" : "keyword" },
        "assuntos" : { "type" : "string", "analyzer" : "keyword" },
        "DataProj" : { "type" : "date", "format" : "dd/MM/YYYY" }
    } 
})
print 'Mapping done'

for row in funkystuff(projetos):
    client.upsert([row])
