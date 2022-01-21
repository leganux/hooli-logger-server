const socket = io();

$(document).ready(function () {
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

    socket.on("logger", function (data) {

        data = JSON.parse(data)
        console.log(data);
        let type = ''

        switch (data?.type) {
            case 'log':
                type = '<span class="badge badge-primary">log</span>'
                break;
            case 'info':
                type = '<span class="badge badge-secondary">info</span>'
                break;
            case 'warn':
                type = '<span class="badge badge-warning">warn</span>'
                break;
            case 'debug':
                type = '<span class="badge badge-info">debug</span>'
                break;
            case 'error':
                type = '<span class="badge badge-danger">error</span>'
                break;
            case 'request':
                type = '<span class="badge badge-dark">request</span>'
                break;
            default:
                type = '<span class="badge badge-light">other</span>'
                break;
        }

        $('#preppend_here').prepend('<tr class="contexto" reference="' + data._id + '" app="' + data.app + '"source="' + data.source + '">' +

            '<td>' +
            moment(data?.date).format() +
            '</td>' +
            '<td>' +
            data?.content +
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
            '</tr>');


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
                let type = ''

                switch (data?.type) {
                    case 'log':
                        type = '<span class="badge badge-primary">log</span>'
                        break;
                    case 'info':
                        type = '<span class="badge badge-secondary">info</span>'
                        break;
                    case 'warn':
                        type = '<span class="badge badge-warning">warn</span>'
                        break;
                    case 'debug':
                        type = '<span class="badge badge-info">debug</span>'
                        break;
                    case 'error':
                        type = '<span class="badge badge-danger">error</span>'
                        break;
                    case 'request':
                        type = '<span class="badge badge-dark">request</span>'
                        break;
                    default:
                        type = '<span class="badge badge-light">other</span>'
                        break;
                }

                $('#preppend_here').prepend('<tr class="contexto" reference="' + data._id + '" app="' + data.app + '"source="' + data.source + '">' +
                    '<td>' +
                    moment(data?.date).format() +
                    '</td>' +
                    '<td>' +
                    data?.content +
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
                    '</tr>');
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
                let type = ''

                switch (data?.type) {
                    case 'log':
                        type = '<span class="badge badge-primary">log</span>'
                        break;
                    case 'info':
                        type = '<span class="badge badge-secondary">info</span>'
                        break;
                    case 'warn':
                        type = '<span class="badge badge-warning">warn</span>'
                        break;
                    case 'debug':
                        type = '<span class="badge badge-info">debug</span>'
                        break;
                    case 'error':
                        type = '<span class="badge badge-danger">error</span>'
                        break;
                    case 'request':
                        type = '<span class="badge badge-dark">request</span>'
                        break;
                    default:
                        type = '<span class="badge badge-light">other</span>'
                        break;
                }


                let html = '<tr class="contexto" reference="' + data._id + '" app="' + data.app + '"source="' + data.source + '">' +
                    '<td>' +
                    moment(data?.date).format() +
                    '</td>' +
                    '<td>' +
                    data?.content +
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
                    '</tr>'

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

