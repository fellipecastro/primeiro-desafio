$(document).ready(function(){    var gitUrl = "https://api.github.com/";    var hash = window.location.hash;    var perPage = 20;    var currentProject;    $(window).hashchange(function(){        hash = window.location.hash;        $("#menu > li").removeClass('active');        $(hash).parent().addClass('active');        $.getJSON(gitUrl + 'repos/globocom/' + $(hash).text(), function(data){            currentProject = data.name;            $('#stars').html('stars ' + data.stargazers_count);            $('#forks').html('forks ' + data.forks_count);            $.getJSON(gitUrl + 'repos/globocom/' + currentProject + '/contributors', function(data){                $('#contribs').html('contribs ' + data.length);            });            getCommits(currentProject, '', 'html');        });        $('#repo_details').show();        $('html').scrollTop(0);    });    $.getJSON(gitUrl + 'users/globocom/repos', function(data){        data.sort(function(a,b){return parseInt(b.stargazers_count) - parseFloat(a.stargazers_count)});        var items = [];                $.each(data, function(key, val){            items.push("<li><a id='" + val.name + "' href='#" + val.name + "'>" + val.name + "</a></li>");        });                $('#menu').html(items.join(""));        $('#right_container').height($('#left_container').height());            if(hash){            $(hash).trigger('click');        }    });    $("#mais").on("click", function(e){        getCommits(currentProject, $('#last_sha').html(), 'append');                e.preventDefault();    });    function getCommits(repo, last_sha, action){        $('#mais').hide();        $.getJSON(gitUrl + 'repos/globocom/' + repo + '/commits?per_page=' + parseInt(perPage + 1) + '&last_sha=' + last_sha, function(data){            var items = [];            $.each(data, function(key, val){                var date = val.commit.author.date;                date = date.split('T')[0];                date = date.split('-');                date = date[2] + '/' + date[1] + '/' + date[0];                if(key == perPage){                    $('#mais').show();                } else{                    commit = "<div class='panel panel-default'>\                        <div class='panel-body'>\                            <div class='grey-box'>";                            if(val.author != null){                                commit += "<img src='" + val.author.avatar_url + "' />";                            }                            commit += "</div>\                                <div class='commit-main'>\                                    <div class='commit-title'>" + val.commit.message + "</div>\                                    <div class='commit-author'>@" + val.commit.author.name + "</div>\                            </div>\                            <div class='commit-date'>" + date + "</div>\                        </div>\                    </div>";                    items.push(commit);                                        if(key < perPage){                        $('#last_sha').html(val.sha);                    }                }            });            if(action == 'append'){                $('#commits').append(items.join(""));            } else if(action == 'html'){                $('#commits').html(items.join(""));            }        });    }});