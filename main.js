$(document).ready(function() {
    $('#setAlarm').prop('disabled', localStorage.getItem('setActive'));
    let audio = new Audio('./media/alarm_sound.mp3');

    $('#setAlarm').on('click', function() {
        localStorage.setItem('pending', 'true');
        setAlarm();
        $('#setAlarm').prop('disabled', true);
        localStorage.setItem('setActive', 'false');
    });

    $('#stopAlarm').on('click', function() {
        localStorage.setItem('pending', 'false');
        $('#stopAlarm').hide();
        stopAlarm();
        initialState()
    });

    $('#alarmDateTime').on('change', function() {
        let alarmDateTime = $(this).val();
        localStorage.setItem('alarmDateTime', alarmDateTime);
        let alarmTime = new Date(alarmDateTime);
        let currentTime = new Date();
        let timeDifference = alarmTime.getTime() - currentTime.getTime();

        if(timeDifference > 0) {
            $('#setAlarm').prop('disabled', false);
            localStorage.setItem('setActive', 'true');
        }
    });

    $('#stop').on('click', function() {
        localStorage.setItem('pending', 'false');
        stopAlarm();
        initialState();
    });

    $('#snooze').on('click', function() {
        localStorage.setItem('pending', 'true');
        $('.alarm').hide();
        snoozeAlarm();
    });

    let alarmDateTime = localStorage.getItem('alarmDateTime');

    if (alarmDateTime !== '') {
        $('#alarmDateTime').val(alarmDateTime);

        if(localStorage.getItem('pending') === 'true') {
            setAlarm();
        }
    }



    function updateTime() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        $('.time').text(pad(hours) + ':' + pad(minutes) + ':' + pad(seconds));
        $('.date').text(now.toDateString());
    }
    setInterval(updateTime, 1000);

    function initialState() {
        localStorage.removeItem('alarmDateTime');
        $('#alarmDateTime').val('');
        $('#setAlarm').prop('disabled', true);
        localStorage.setItem('setActive', 'false');
        $('#stopAlarm').css('display', 'none');
    }

    function pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    function setAlarm() {
        let alarmDateTime = $('#alarmDateTime').val();
        localStorage.setItem('alarmDateTime', alarmDateTime);
        let alarmTime = new Date(alarmDateTime);
        let currentTime = new Date();

        let timeDifference = alarmTime.getTime() - currentTime.getTime();

        if(timeDifference >= 0) {
            $('#stopAlarm').show();
            setTimeout(function() {
                playAlarm();
            }, timeDifference);
        }

        $('#setAlarm').prop('disabled', false);
        localStorage.setItem('setActive', 'true');
    }

    function playAlarm() {
        audio.loop = true;
        audio.play();
        $('.alarm').css('display', 'block');
        let alarmTime = new Date(localStorage.getItem('alarmDateTime'));
        let hours = alarmTime.getHours();
        let minutes = alarmTime.getMinutes();
        $('#time').text(pad(hours) + ':' + pad(minutes));
        $('#setAlarm').prop('disabled', true);
        localStorage.setItem('setActive', 'false');
    }

    function stopAlarm() {
        $('.alarm').css('display', 'none');

        if(audio) {
            audio.pause();
        }
    }

    function snoozeAlarm() {
        let snoozeTime = 60000;
        let now = new Date();
        let newAlarmTime = new Date(now.getTime() + snoozeTime);
        let newAlarmTimeString =
            newAlarmTime.getFullYear() + '-' +
            pad(newAlarmTime.getMonth() + 1) + '-' +
            pad(newAlarmTime.getDate()) + 'T' +
            pad(newAlarmTime.getHours()) + ':' +
            pad(newAlarmTime.getMinutes());
        localStorage.setItem('alarmDateTime', newAlarmTimeString);
        stopAlarm();
        setTimeout(function() {
            playAlarm();
        }, snoozeTime);
    }
});
