const socket = io();

$(document).ready(function () {

    let playing = true

    $('#play').click(function () {
        playing = !playing
        if (playing) {
            $('#play').text('Pause')
        } else {
            $('#play').text('Play')
        }
    })

    socket.on("connect", function (data) {
        console.log('Cliente conectado');
    });
    socket.on("disconnect", function (data) {
        console.log('Cliente desconectado');
    });
    /* let data = []
     const ctx = document.getElementById('myChart').getContext('2d');
     const myChart = new Chart(ctx, {
         type: 'line',
         data: data,
         options: {
             responsive: true,
             plugins: {
                 legend: {
                     position: 'top',
                 },
                 title: {
                     display: true,
                     text: 'Chart.js Line Chart'
                 }
             }
         },
     });*/


    $('#type').select2();

    let tansformer = function (content) {
        try {
            content = JSON.parse(content)
        } catch (e) {
            content = content
        }
        if (content && typeof content == 'object') {
            if (Array.isArray(content)) {
                content = JSON.stringify(content)
            } else {
                let newContent = []
                for (var [key, value] of Object.entries(content)) {
                    if (typeof value == 'text') {
                        newContent.push(value)
                    } else {
                        let pre = '<pre>' + JSON.stringify(value, undefined, 2) + '</pre>'
                        newContent.push(pre)
                    }

                }
                content = newContent.join('<hr>')
            }
        }
        return content
    }

    let makeIt = function (data) {

        let type = ''
        let content = ''

        if (data?.type == 'request') {
            try {
                let item = JSON.parse(data.content)
                let kind = ''
                switch (item?.method) {
                    case 'POST':
                        kind = '<span class="badge badge-primary"><h3> ' + item.method + ' </h3></span>'
                        break;
                    case 'PUT':
                        kind = '<span class="badge badge-info"><h3> ' + item.method + ' </h3></span>'
                        break;
                    case 'GET':
                        kind = '<span class="badge badge-success"><h3> ' + item.method + ' </h3></span>'
                        break;
                    case 'OPTIONS':
                        kind = '<span class="badge badge-warning"><h3> ' + item.method + ' </h3></span>'
                        break;
                    case 'DELETE':
                        kind = '<span class="badge badge-danger"><h3> ' + item.method + ' </h3></span>'
                        break;
                    default:
                        kind = '<span class="badge badge-primary"><h3> ' + item.method + ' </h3></span>'
                        break;
                }

                content = kind +
                    '<br>' +
                    '<label> URL: ' + item.url + '</label>' +
                    '<br>' +
                    '<label> STATUS:' + item.status + '</label>' +
                    '<br>' +
                    '<label> Body:' + '</label> ' + '<pre>' + JSON.stringify(item.body, undefined, 2) + '</pre>' +
                    '<br>' +
                    '<label> Query:' + '</label> ' + '<pre>' + JSON.stringify(item.query, undefined, 2) + '</pre>' +
                    '<br>' +
                    '<label> Params:' + '</label> ' + '<pre>' + JSON.stringify(item.params, undefined, 2) + '</pre>'
            } catch (e) {
                content = data.content
                content = tansformer(content)
            }
        } else {
            content = data.content
            content = tansformer(content)
        }

        let class_ = 'table-primary'
        switch (data?.type) {
            case 'log':
                type = '<span class="badge badge-primary">log</span>'
                break;
            case 'info':
                type = '<span class="badge badge-secondary">info</span>'
                class_ = 'table-secondary'
                break;
            case 'warn':
                type = '<span class="badge badge-warning">warn</span>'
                class_ = 'table-warning'
                break;
            case 'debug':
                type = '<span class="badge badge-info">debug</span>'
                class_ = 'table-info'
                break;
            case 'error':
                type = '<span class="badge badge-danger">error</span>'
                class_ = 'table-danger'
                break;
            case 'request':
                type = '<span class="badge badge-dark">request</span>'
                class_ = 'table-light'
                break;
            default:
                type = '<span class="badge badge-light">other</span>'
                class_ = 'table-dark'
                break;
        }

        return '<tr class="contexto ' + class_ + '" reference="' + data._id + '" app="' + data.app + '"source="' + data.source + '">' +
            '<td>' +
            moment(data?.date).format() +
            '</td>' +
            '<td>' +
            type +
            '</td>' +
            '<td>' +
            data?.app +
            '</td>' +
            '<td>' +
            data?.source +
            '</td>' +
            '<td>' +
            content +
            '</td>' +
            '</tr>';


    }

    socket.on("logger", function (data) {

        data = JSON.parse(data)

        if (playing) {

            let type_ = $('#type').val()
            console.log(type_, data)
            if (data?.type === type_ || type_ === '-1') {
                $('#preppend_here').prepend(makeIt(data));
            }

        }


    });

    $('#clear').click(function () {
        $('#preppend_here').html('')
    })

    $('#apply').click(function () {
        $('#preppend_here').html('')
        let app = $('#app').val()
        let source = $('#source').val()
        let type = $('#type').val()
        let start = $('#start').val()
        let end = $('#end').val()
        let like = $('#like').val()
        let limit = $('#limit').val()

        let body = {}

        if (app && app.length > 0) {
            body.app = app.join(',')
        }
        if (source && source.length > 0) {
            body.source = source.join(',')
        }
        if (type && type != -1) {
            body.type = type
        }
        if (limit && limit != '') {
            body.limit = limit
        }
        if (like && like != '') {
            body.like = like
        }

        if (start && end && start != '' && end != '') {
            body.time = start + ',' + end
        }

        $.getJSON('/log', body, function (data_) {
            for (let data of data_?.data) {
                $('#preppend_here').prepend(makeIt(data));
            }
        })

    })

    $.getJSON('/catalogs', {}, function (data) {
        console.log(data)
        for (let item of data?.data?.source) {
            console.log(item)
            $('#source').append('<option value="' + item.source + '">' + item.source + '</option>')
        }
        $('#source').select2();
        for (let item of data?.data?.app) {
            $('#app').append('<option value="' + item.app + '">' + item.app + '</option>')
        }
        $('#app').select2();
    })

    $('#apply').click()

    $('#clse_modal').click(function () {
        $('#modal_').modal('hide')
    })

    $(document.body).on('click', '.contexto', function () {
        let reference = $(this).attr('reference')
        let app = $(this).attr('app')
        let source = $(this).attr('source')
        console.log(reference, app, source)

        $('#modal_').modal('show')
        let body = {}

        let start = Number(reference) - 10
        let end = Number(reference) + 10

        body.contexto = start + ',' + end
        body.app = app
        body.source = source
        $('#preppend_here_after').html('')
        $('#preppend_here_this').html('')
        $('#preppend_here_before').html('')

        $.getJSON('/log', body, function (data_) {
            for (let data of data_?.data) {

                let html = makeIt(data)

                if (data._id < Number(reference)) {
                    $('#preppend_here_after').append(html);
                }
                if (data._id == Number(reference)) {
                    $('#preppend_here_this').append(html);
                }
                if (data._id > Number(reference)) {
                    $('#preppend_here_before').append(html);
                }


            }
        })
    })

})

