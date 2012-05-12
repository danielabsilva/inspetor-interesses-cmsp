function termosComuns() {
  var q = {
      "query" : {
                "match_all" : {}
            },
        "size":0,
        "from":0,
        "facets" : {
            "assuntos" : {
                "terms" : {
                    "field" : "assuntos",
                    "size" : 15
                    }
                }
            }
  };
  
  $.ajax({  
    url: my.base_url + '/_search?source=' + JSON.stringify(q),  
    dataType: 'json',  
    //data: data,  
    async: false,  
    success: function(data) {  
        my.termos_comuns = [];
        $.each(data.facets.assuntos.terms, function(key, data) {
            my.termos_comuns.push(data.term);
        });
    }  
    });
      
};

function carregaCampeao() {
    var tags = my.termos_unicos;
    var q = {
        "query" : {
            "term" : {
                "assuntos" : "tag"
                    }
                },
            size : 0,
            from: 0,
            "facets" : {
                "autores" : {
                    "terms" : {
                        "field" : "autores",
                        "size" : 3
                        }
                    }
                }
            };
    
    var campeao = false;
    $.each(tags, function(key, data) {
        if (campeao != true) {
            var assunto = data;
            q.query.term.assuntos = assunto;
            console.log('Trying ' + assunto);
            $.ajax({  
                url: my.base_url + '/_search?source=' + JSON.stringify(q),  
                dataType: 'json',  
                //data: data,  
                async: false,  
                success: function(data){
                    if (data.facets.autores.terms[0].term == my.vereador) {
                        $("#termocampeao").text(assunto);
                        campeao = true;
                    }
                }  
            });
        }
    });

};

function carregaResultados() {
    $.getJSON(my.url, function(data) {
            $("#nome h2").text(my.vereador);
            $.each(data.facets.autores.terms, function(key, data) {
                if (my.termos_comuns.indexOf(data.term) > 0) {
                    $("#top3 ul").append("<li class='comum'>" + data.term + "(" + data.count + ")" + "</li>");
                }
                else {
                    my.termos_unicos.push(data.term);
                    $("#top3 ul").append("<li>" + data.term + "(" + data.count + ")" + "</li>");
                }
                });
        });
    }


