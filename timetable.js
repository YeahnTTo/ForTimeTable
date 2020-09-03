$(function () {
    let start_time_option_html = '';
    let end_time_option_html = '';
    let start_hour = 9;
    let end_hour = 10;
    for(let i=1;i<10;i++){
        let j = i+1;
        start_time_option_html += '<option value="'+i+'">'+start_hour+'</option>';
        end_time_option_html += '<option value="'+j+'">'+end_hour+'</option>';
        start_hour++;
        end_hour++;
    }
    $("#select-start-time").append(start_time_option_html);
    $("#select-end-time").append(end_time_option_html);


    $("#set-table").on('click', function(){
        let time_gap = 1;
        let _day = $("#select-day").val();
        let start_t = $("#select-start-time").val();
        let end_t = $("#select-end-time").val();
        let name = $("#input-name").val();
        let link = $("#input-link").val();
        name = $.trim(name);
        start_t = Number(start_t);
        end_t = Number(end_t);

        // 과목명 빈값 체크
        if(name.length == 0) {
            alert("과목명은 필수다.");
            $("#input-name").val('');
            $("#input-name").focus();
            return false;
        }

        // 시작시간 종료시간 체크
        if(start_t > end_t) {
            alert("종료시간이 시작시간보다 일찍일 수는 없다.");
            $("#select-end-time").focus();
            return false;
        }

        // 입력할 컬럼 아이디 생성
        let col_id = "#"+_day+"-"+start_t;
        if(start_t < end_t) {
            time_gap = end_t - start_t;
        }
        
        // 시간 겹침 체크
        if($(col_id).hasClass('hide') || $(col_id).attr('rowspan') > 0 || $(col_id).text().length > 0) {
            if(confirm("시간 겹침. 그래도 입력 할테냐?")){
                if($(col_id).text().length > 0){
                    $(col_id).text('');
                }
                remove_rowspan(_day, start_t, end_t, time_gap);
                input_col_text(col_id, name, link);
                if(time_gap >= 2) {
                    $(col_id).attr('rowspan',time_gap);
                    hide_col(_day,start_t, end_t,time_gap);
                }
            } else {
                return false;
            }
        } else {
            input_col_text(col_id, name, link);
            if(time_gap >= 2) {
                $(col_id).attr('rowspan',time_gap);
                hide_col(_day,start_t, end_t,time_gap);
            }

        }
    });

    $("#btn-down").on('click',function(){
        htmlDownload();
    });
});

// 시작 rowspan 이후로 범위 컬럼 숨기기
function hide_col(_day, start_t, end_t,time_gap) {
    let tr = $("#"+_day+"-"+start_t).closest('tr');
    let rowspan = $("#"+_day+"-"+start_t).attr('rowspan');
    let index = $('tr').index(tr);
    let tot = parseInt(index)+parseInt(rowspan);
    for(var i=index+1;i<=tot;i++){
        $("#"+_day+"-"+i).removeAttr('rowspan');
        $("#"+_day+"-"+i).text('');
        $("#"+_day+"-"+i).addClass('hide');
    }

    if($("#"+_day+"-"+end_t).attr('rowspan') !== typeof undefined && $("#"+_day+"-"+end_t).attr('rowspan')  !== false) {
        $("#"+_day+"-"+end_t).removeAttr('rowspan');
    }

    for(let k=end_t;k<=9;k++) {
        let attr = $("#"+_day+"-"+k).attr('rowspan');
        // rowspan이 나올때 까지 hide클래스를 지운다.
        if(typeof attr !== typeof undefined && attr !== false){
            break;
        } else {
            $("#"+_day+"-"+k).removeClass('hide');
        }
    }
}

// 컬럼 위치에 과목명과 링크 삽입
function input_col_text(col_id, name, link=null) {
    let regx = new RegExp(/(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi);

    if(link){
        if(regx.test(link)){

            $(col_id).append("<div onclick='window.open(\""+link+"\")'>"+name+"</div>");
        } else {

            $(col_id).append("<div onclick='window.open(\"https://"+link+"\")'>"+name+"</div>");
        }
    } else {
        $(col_id).append("<div>"+name+"</div>");
    }
}

// 덮어쓰기 할 때 겹치는 rowspan 제거
function remove_rowspan(_day, start_t, end_t, time_gap) {
    for(let i=start_t;i>=1;i--) {
        let attr = $("#"+_day+"-"+i).attr('rowspan');
        // rowspan이 있는 경우
        if(typeof attr !== typeof undefined && attr !== false){
            $("#"+_day+"-"+i).removeAttr('rowspan');
            $("#"+_day+"-"+i).text('');

            if(end_t<attr) {
                for(let j=end_t+1;j>attr;j++) {
                    $("#"+_day+"-"+j).removeClass('hide');
                }
            }
        } else {
            $("#"+_day+"-"+i).removeClass('hide');
        }
    }

    $("#"+_day+"-"+start_t).removeClass('hide');
    $("#"+_day+"-"+start_t).attr('rowspan', time_gap);


    for(let k=start_t+time_gap;k<=9;k++) {
        let attr = $("#"+_day+"-"+k).attr('rowspan');
        // rowspan이 나올때 까지 hide클래스를 지운다.
        if(typeof attr !== typeof undefined && attr !== false){
            break;
        } else {
            $("#"+_day+"-"+k).removeClass('hide');
        }
    }
}

function htmlDownload() {
    $("#table-download").attr( "href", "https://yeahntto.github.io/ForTimeTable/").get(0).click();
    $("#table-download").trigger('click');


}