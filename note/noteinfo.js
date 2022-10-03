// 노트 상세 정보 표시
function displaynoteInfo(index) {
	var len,
	    i,
	    type = "",
	    name = "",
	    answer = "",
	    pic = "";

	// 노트 상세 정보를 설정
	var mynoteRecord = recordSet.rows.item(index);
	varPosition = index;

	if (mynoteRecord.name != null) {// 과목
		type = '<p>과목 : ' + mynoteRecord.type + '</p>';
	} else {
		type = '<p>과목 : 정보없음</p>';
	}

	if (mynoteRecord.name != null) {// 제목
		name = '<p>제목 : ' + mynoteRecord.name + '</p>';
	} else {
		name = '<p>제목 : 정보없음</p>';
	}

	if (mynoteRecord.name != null) {// 풀이
		answer = '<p>풀이 : ' + mynoteRecord.answer + '</p>';
	} else {
		answer = '<p>풀이 : 정보없음</p>';
	}
	
	if (mynoteRecord.name != null) {// 풀이
		pic = '<img class="my_listview_img" src="' + mynoteRecord.pic + '">';
	} else {
		pic = '<p>풀이 : 정보없음</p>';
	}

	$('#noteInfoArea').html(type + name + answer+pic);
	$.mobile.changePage("#noteInfoShowPage", "slide", false, true);
}


