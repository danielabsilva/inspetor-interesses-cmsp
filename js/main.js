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
  $.getJSON(my.base_url + '/_search?source=' + JSON.stringify(q), function(data) {
        my.termos_comuns = [];
        $.each(data.facets.assuntos.terms, function(key, data) {
            my.termos_comuns.push(data.term);
        });
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
                    $("#top3 ul").append("<li>" + data.term + "(" + data.count + ")" + "</li>");
                }
                });
        });
    }


