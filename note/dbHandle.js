var db = null;
var var_no = null;
var position = null;
var index;

// 데이터베이스 생성 및 오픈
function openDB() {
	db = window.openDatabase('noteDB', '1.0', '노트DB', 1024 * 1024);
	console.log('1_DB 생성 ');
}

// 테이블 생성 트랜잭션 실행
function createTable() {
	db.transaction(function(tr) {
		var createSQL = 'create table if not exists note(type text, name text, answer text, pic varchar(50))';
		//칼럼 추가할때 drop table note로 테이블 지우고 재생성 해야함  create table if not exists note(type text, name text, answer text, pic varchar(50))
		tr.executeSql(createSQL, [], function() {
			console.log('2_1_테이블생성_sql 실행 성공 ');
		}, function() {
			console.log('2_1_테이블생성_sql 실행 실패 ');
		});
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 실패 롤백은 자동');
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 성공 ');
	});
}

// 데이터 입력 트랜잭션 실행
function insertnote() {
	db.transaction(function(tr) {
		var type = $('#noteType1').val();
		var name = $('#noteName1').val();
		var answer = $('#noteAnswer1').val();
		var pic = $('#notePicture1').attr("src");
		var insertSQL = 'insert into note(type, name, answer, pic) values(?, ?, ?, ?)';
		tr.executeSql(insertSQL, [type, name, answer, pic], function(tr, rs) {
			console.log('3_ 문제 등록 no: ' + rs.insertId);
			alert('문제명 ' + $('#noteName1').val() + ' 이(가) 입력되었습니다');
				window.location.reload();
			$('#noteName1').val('');
			$('#noteType1').val('미정').attr('selected', 'selected');

		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});

}

// 전체 데이터 검색 트랜잭션 실행
function listnote(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from note';    
  	tr.executeSql(selectSQL, [], function(tr, rs){    
       console.log(' 노트 조회  ' + rs.rows.length + '건.');
       if (position == 'first') {
       	  if(index == 0) 
       	  	alert('더 이상의 문제가 없습니다');   
          else       	
          	index = 0;
	   	 }
       else if (position == 'prev') {
       	  if(index == 0) 
       	  	alert('더 이상의 문제가 없습니다');   
          else
          	index = --index;
	 		 }
       else if (position == 'next') {
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 문제가 없습니다');          	
		      else
		      	index = ++index;
       }
       else 
       {  
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 문제가 없습니다');          	
		      else       	
	       	  index = rs.rows.length-1;
       }
       $('#noteType4').val(rs.rows.item(index).type);
       $('#noteName4').val(rs.rows.item(index).name);
 		});   
  });           
}

// 데이터 수정 트랜잭션 실행
function updatenote(){
    db.transaction(function(tr){
    	var type = $('#noteType2').val();
    	var new_name = $('#noteName2').val();
    	var old_name = $('#snoteName2').val();
    	var answer = $('#noteAnswer2').val();
		var pic = $('#notePicture2').attr("src");

		var updateSQL = 'update note set type = ?, name = ?, answer = ?, pic = ? where name = ?';          
     	tr.executeSql(updateSQL, [type, new_name, answer, pic, old_name], function(tr, rs){    
	         console.log('5_노트 수정 . ') ;
	         alert('문제명 ' + $('#snoteName2').val() + ' 이(가) 수정되었습니다'); 
	         window.location.reload();  	         
	   		 $('#noteName2').val(''); $('#snoteName2').val('');   
	   		 $('#noteType2').val('미정').attr('selected', 'selected'); 
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });       
}

// 데이터 삭제 트랜잭션 실행
function deletenote() {
	db.transaction(function(tr) {
		var name = $('#snoteName2').val();
		var deleteSQL = 'delete from note where name = ?';
		tr.executeSql(deleteSQL, [name], function(tr, rs) {
			console.log('6_노트 삭제  ');
			alert('문제명 ' + $('#noteName2').val() + ' 이 삭제되었습니다');
			window.location.reload();
			$('#noteType2').val('');
			$('#noteName2').val('');
			$('#snoteName2').val('');
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}

// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectnote2(name) {
	db.transaction(function(tr) {
		var selectSQL = 'select type, name, answer, pic from note where name=?';
		tr.executeSql(selectSQL, [name], function(tr, rs) {
			$('#noteType2').val(rs.rows.item(0).type).attr('selected', 'selected'); //이름불러오기
			$('#noteName2').val(rs.rows.item(0).name).attr('selected', 'selected'); //과목불러오기
			$('#noteAnswer2').val(rs.rows.item(0).answer).attr('selected', 'selected'); //풀이불러오기
			$("#notePicture2").attr("src",(rs.rows.item(0).pic));
			
		});
	});
}

// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectnote3(name) {
	db.transaction(function(tr) {
		var selectSQL = 'select type, name from note where name=?';
		tr.executeSql(selectSQL, [name], function(tr, rs) {
			$('#noteType3').val(rs.rows.item(0).type);
			$('#noteName3').val(rs.rows.item(0).name);
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}

// 데이터 조건 검색 트랜잭션 실행
function selectnote4(name) {
	db.transaction(function(tr) {
		var selectSQL = 'select type, name from note where name=?';
		tr.executeSql(selectSQL, [name], function(tr, rs) {
			$('#noteType4').val(rs.rows.item(0).type);
			$('#noteName4').val(rs.rows.item(0).name);
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
};

function shownote1() {
	db.transaction(function(tr) {
		var i,
		    count,
		    tagList = '';
		var selectSQL = 'select * from note ';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			console.log(' 노트 ' + rs.rows.length + '건.');
			recordSet = rs;
			count = rs.rows.length;
			if (count > 0) {
				tagList = '<li data-role="list-divider">문제 목록' + '<span style="float:right">' + count + '건' + '</span></li>';
				for ( i = 0; i < count; i += 1) {
					tagList += '<li><a onclick="displaynoteInfo(' + i + ')">';
					
					
					
					tagList += '<h2>' + rs.rows.item(i).type + '</h2>';
					tagList += '<p>' + rs.rows.item(i).name + '</p>';

				}
				$('#noteListArea').html(tagList);
				$('#noteListArea').listview();
			} else {
				navigator.notification.alert('검색 결과 없음', null, '맛집 검색 실패');
			}
		});
	});
}

