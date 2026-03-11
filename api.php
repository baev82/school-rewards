<?php
/**
 * School Rewards API v4 — Multi-child PHP + SQLite
 */
error_reporting(E_ALL);
ini_set('display_errors','0');
ini_set('log_errors','1');
set_error_handler(function($n,$s,$f,$l){throw new ErrorException($s,0,$n,$f,$l);});
register_shutdown_function(function(){
    $e=error_get_last();
    if($e&&in_array($e['type'],[E_ERROR,E_PARSE,E_CORE_ERROR])){
        if(!headers_sent()){header('Content-Type: application/json; charset=utf-8');http_response_code(500);}
        echo json_encode(['error'=>$e['message'],'file'=>basename($e['file']),'line'=>$e['line']]);
    }
});
try {
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(204);exit;}

define('DB_PATH',__DIR__.'/data/school_rewards.db');
define('UPLOAD_DIR',__DIR__.'/uploads/');
define('PER_PAGE',20);
if(!is_dir(dirname(DB_PATH)))mkdir(dirname(DB_PATH),0777,true);
if(!is_dir(UPLOAD_DIR))mkdir(UPLOAD_DIR,0777,true);

$DEFAULT_SUBJECTS=[
    'ru'=>['Математика','Биология','Литература','История','Иностранный язык'],
    'en'=>['Mathematics','Biology','Literature','History','Foreign Language'],
    'zh'=>['数学','生物','文学','历史','外语'],
    'hi'=>['गणित','जीव विज्ञान','साहित्य','इतिहास','विदेशी भाषा'],
    'es'=>['Matemáticas','Biología','Literatura','Historia','Lengua Extranjera'],
    'ar'=>['الرياضيات','الأحياء','الأدب','التاريخ','اللغة الأجنبية'],
    'fr'=>['Mathématiques','Biologie','Littérature','Histoire','Langue Étrangère'],
    'bn'=>['গণিত','জীববিদ্যা','সাহিত্য','ইতিহাস','বিদেশী ভাষা'],
    'pt'=>['Matemática','Biologia','Literatura','História','Língua Estrangeira'],
    'it'=>['Matematica','Biologia','Letteratura','Storia','Lingua Straniera'],
    'ja'=>['数学','生物','文学','歴史','外国語'],
    'de'=>['Mathematik','Biologie','Literatur','Geschichte','Fremdsprache'],
    'vi'=>['Toán','Sinh học','Văn học','Lịch sử','Ngoại ngữ'],
    'tr'=>['Matematik','Biyoloji','Edebiyat','Tarih','Yabancı Dil'],
    'ko'=>['수학','생물','문학','역사','외국어'],
];

// ============ DATABASE ============
function getDB(): SQLite3 {
    static $db=null;
    if($db)return $db;
    $isNew=!file_exists(DB_PATH);
    $db=new SQLite3(DB_PATH);
    $db->exec('PRAGMA journal_mode=WAL');
    $db->exec('PRAGMA foreign_keys=ON');
    if($isNew)initDB($db);
    migrate($db);
    return $db;
}

function migrate($db){
    // Ensure all tables exist for existing DBs
    $db->exec("CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY CHECK(id BETWEEN 1 AND 10),
        name TEXT NOT NULL DEFAULT '',
        pin TEXT NOT NULL DEFAULT '',
        active INTEGER DEFAULT 0,
        child_theme TEXT DEFAULT 'pink',
        lang TEXT DEFAULT 'ru',
        currency TEXT DEFAULT '₽',
        school_year TEXT DEFAULT ''
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    $db->exec("CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
        lang TEXT DEFAULT 'ru', active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now','localtime'))
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL DEFAULT 1,
        grade INTEGER NOT NULL, grade_label TEXT DEFAULT '', subject_id INTEGER NOT NULL,
        subject_name TEXT DEFAULT '', screenshot TEXT DEFAULT '', comment TEXT DEFAULT '',
        grade_date TEXT DEFAULT '', status TEXT DEFAULT 'pending',
        amount REAL DEFAULT 0, school_year TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now','localtime')),
        reviewed_at TEXT, FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL DEFAULT 1,
        amount REAL NOT NULL, payment_date TEXT NOT NULL, note TEXT DEFAULT '',
        school_year TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now','localtime'))
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS school_years (
        id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL,
        year_label TEXT NOT NULL, class_name TEXT DEFAULT '',
        is_current INTEGER DEFAULT 0
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL DEFAULT 1,
        title TEXT NOT NULL, status TEXT DEFAULT 'todo',
        due_date TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now','localtime')),
        completed_at TEXT
    )");
    $db->exec("CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL DEFAULT 1,
        sender TEXT NOT NULL DEFAULT 'mama', text TEXT NOT NULL,
        is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now','localtime'))
    )");
    // Add child_id columns if missing (migration from v3)
    $cols=$db->querySingle("SELECT sql FROM sqlite_master WHERE name='grades'");
    if($cols && strpos($cols,'child_id')===false){
        $db->exec("ALTER TABLE grades ADD COLUMN child_id INTEGER NOT NULL DEFAULT 1");
        $db->exec("ALTER TABLE payments ADD COLUMN child_id INTEGER NOT NULL DEFAULT 1");
        $db->exec("ALTER TABLE todos ADD COLUMN child_id INTEGER NOT NULL DEFAULT 1");
        $db->exec("ALTER TABLE messages ADD COLUMN child_id INTEGER NOT NULL DEFAULT 1");
    }
    // Ensure at least child 1 exists
    $c=$db->querySingle("SELECT COUNT(*) FROM children");
    if($c==0){
        $db->exec("INSERT INTO children (id,name,pin,active,child_theme) VALUES (1,'София','1234',1,'pink')");
    }
}

function initDB(SQLite3 $db): void {
    global $DEFAULT_SUBJECTS;
    $db->exec("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    $defaults=['pin_parent'=>'0000','lang'=>'ru','currency'=>'₽',
        'price_5'=>'100','price_4'=>'40','price_3'=>'-30','price_2'=>'-100','price_1'=>'-200'];
    $stmt=$db->prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (:k,:v)");
    foreach($defaults as $k=>$v){$stmt->bindValue(':k',$k);$stmt->bindValue(':v',$v);$stmt->execute();$stmt->reset();}
    // Subjects
    $db->exec("CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,lang TEXT DEFAULT 'ru',active INTEGER DEFAULT 1,created_at TEXT DEFAULT (datetime('now','localtime')))");
    foreach($DEFAULT_SUBJECTS['ru'] as $n) $db->exec("INSERT INTO subjects (name,lang) VALUES ('".SQLite3::escapeString($n)."','ru')");
}

function getSetting($db,$key){$r=$db->prepare("SELECT value FROM settings WHERE key=:k");$r->bindValue(':k',$key);$row=$r->execute()->fetchArray(SQLITE3_ASSOC);return $row?$row['value']:null;}
function jsonOut($data,$code=200){http_response_code($code);echo json_encode($data,JSON_UNESCAPED_UNICODE);exit;}
function getJSON(){return json_decode(file_get_contents('php://input'),true)?:[];}

function paginate($db,$countSQL,$dataSQL,$params=[]){
    $page=max(1,intval($_GET['page']??1));$offset=($page-1)*PER_PAGE;
    $stmt=$db->prepare($countSQL);foreach($params as $k=>$v)$stmt->bindValue($k,$v);
    $total=$stmt->execute()->fetchArray()[0];
    $stmt=$db->prepare($dataSQL." LIMIT :lim OFFSET :off");
    foreach($params as $k=>$v)$stmt->bindValue($k,$v);
    $stmt->bindValue(':lim',PER_PAGE,SQLITE3_INTEGER);$stmt->bindValue(':off',$offset,SQLITE3_INTEGER);
    $result=$stmt->execute();$items=[];
    while($row=$result->fetchArray(SQLITE3_ASSOC))$items[]=$row;
    return ['items'=>$items,'total'=>$total,'page'=>$page,'per_page'=>PER_PAGE,'pages'=>max(1,intval(ceil($total/PER_PAGE)))];
}

// ============ ROUTING ============
$method=$_SERVER['REQUEST_METHOD'];
$path=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$path=preg_replace('#^/api\.php#','',$path);
$path=preg_replace('#^/api#','',$path);
$path=rtrim($path,'/')?:'/';
$db=getDB();

// Helper: get child_id from query or POST
function cid(){return intval($_GET['child_id']??$_POST['child_id']??getJSON()['child_id']??1);}

// ---- AUTH ----
if($path==='/login'&&$method==='POST'){
    $data=getJSON();$pin=$data['pin']??'';
    if($pin===getSetting($db,'pin_parent'))jsonOut(['role'=>'parent']);
    // Check children PINs
    $stmt=$db->prepare("SELECT id,name FROM children WHERE pin=:p AND active=1");
    $stmt->bindValue(':p',$pin);$row=$stmt->execute()->fetchArray(SQLITE3_ASSOC);
    if($row)jsonOut(['role'=>'child','child_id'=>$row['id'],'child_name'=>$row['name']]);
    jsonOut(['error'=>'Wrong PIN'],401);
}

// ---- CHILDREN ----
if($path==='/children'&&$method==='GET'){
    $r=$db->query("SELECT * FROM children ORDER BY id");$items=[];
    while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;
    jsonOut($items);
}
if($path==='/children'&&$method==='POST'){
    $data=getJSON();$id=intval($data['id']??0);
    if($id<1||$id>10)jsonOut(['error'=>'ID 1-10'],400);
    $name=trim($data['name']??'');$pin=$data['pin']??'';$active=intval($data['active']??0);
    $theme=$data['child_theme']??'pink';$lang=$data['lang']??'ru';$cur=$data['currency']??'₽';
    $sy=$data['school_year']??'';
    // PIN duplicate check
    if($pin&&$active){
        $dup=$db->prepare("SELECT id,name FROM children WHERE pin=:p AND id!=:id AND active=1");
        $dup->bindValue(':p',$pin);$dup->bindValue(':id',$id);$dupRow=$dup->execute()->fetchArray(SQLITE3_ASSOC);
        if($dupRow)jsonOut(['error'=>'PIN уже используется: '.$dupRow['name']],400);
        // Also check parent PIN
        if($pin===getSetting($db,'pin_parent'))jsonOut(['error'=>'PIN совпадает с родительским'],400);
    }
    $db->exec("INSERT OR REPLACE INTO children (id,name,pin,active,child_theme,lang,currency,school_year) VALUES ($id,'".SQLite3::escapeString($name)."','".SQLite3::escapeString($pin)."',$active,'".SQLite3::escapeString($theme)."','".SQLite3::escapeString($lang)."','".SQLite3::escapeString($cur)."','".SQLite3::escapeString($sy)."')");
    jsonOut(['ok'=>true]);
}
if(preg_match('#^/children/(\d+)$#',$path,$m)&&$method==='GET'){
    $id=intval($m[1]);$r=$db->prepare("SELECT * FROM children WHERE id=:id");$r->bindValue(':id',$id);
    $row=$r->execute()->fetchArray(SQLITE3_ASSOC);
    jsonOut($row?:['id'=>$id,'name'=>'','pin'=>'','active'=>0,'child_theme'=>'pink','lang'=>'ru','currency'=>'₽']);
}

// ---- SETTINGS (global: parent pin, prices) ----
if($path==='/settings'&&$method==='GET'){
    $r=$db->query("SELECT key,value FROM settings");$s=[];
    while($row=$r->fetchArray(SQLITE3_ASSOC))$s[$row['key']]=$row['value'];
    jsonOut($s);
}
if($path==='/settings'&&$method==='POST'){
    $data=getJSON();
    $allowed=['pin_parent','lang','currency','price_5','price_4','price_3','price_2','price_1'];
    $stmt=$db->prepare("INSERT OR REPLACE INTO settings (key,value) VALUES (:k,:v)");
    foreach($allowed as $k){if(isset($data[$k])){$stmt->bindValue(':k',$k);$stmt->bindValue(':v',(string)$data[$k]);$stmt->execute();$stmt->reset();}}
    jsonOut(['ok'=>true]);
}

// ---- SUBJECTS (shared) ----
if($path==='/subjects'&&$method==='GET'){
    $active=($_GET['active']??'0')==='1';$w=$active?"WHERE active=1":"";
    $r=$db->query("SELECT * FROM subjects $w ORDER BY name");$items=[];
    while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;jsonOut($items);
}
if($path==='/subjects'&&$method==='POST'){
    $data=getJSON();$name=trim($data['name']??'');if(!$name)jsonOut(['error'=>'Empty'],400);
    $stmt=$db->prepare("INSERT INTO subjects (name,lang) VALUES (:n,:l)");
    $stmt->bindValue(':n',$name);$stmt->bindValue(':l',$data['lang']??'ru');$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if(preg_match('#^/subjects/(\d+)/toggle$#',$path,$m)&&$method==='POST'){
    $db->exec("UPDATE subjects SET active=1-active WHERE id=".intval($m[1]));jsonOut(['ok'=>true]);
}
if(preg_match('#^/subjects/(\d+)$#',$path,$m)&&$method==='DELETE'){
    $id=intval($m[1]);
    if($db->querySingle("SELECT COUNT(*) FROM grades WHERE subject_id=$id")>0)jsonOut(['error'=>'Has grades'],400);
    $db->exec("DELETE FROM subjects WHERE id=$id");jsonOut(['ok'=>true]);
}
if($path==='/subjects/reset'&&$method==='POST'){
    global $DEFAULT_SUBJECTS;$data=getJSON();$lang=$data['lang']??'ru';
    $db->exec("DELETE FROM subjects WHERE id NOT IN (SELECT DISTINCT subject_id FROM grades)");
    $stmt=$db->prepare("INSERT INTO subjects (name,lang) VALUES (:n,:l)");
    foreach($DEFAULT_SUBJECTS[$lang]??$DEFAULT_SUBJECTS['en'] as $n){$stmt->bindValue(':n',$n);$stmt->bindValue(':l',$lang);$stmt->execute();$stmt->reset();}
    jsonOut(['ok'=>true]);
}

// ---- GRADES (per child) ----
if($path==='/grades'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);$status=$_GET['status']??'';$sy=$_GET['school_year']??'';
    $w="WHERE g.child_id=:cid";$p=[':cid'=>$cid];
    if($status){$w.=" AND g.status=:st";$p[':st']=$status;}
    if($sy){$w.=" AND g.school_year=:sy";$p[':sy']=$sy;}
    $result=paginate($db,"SELECT COUNT(*) FROM grades g $w","SELECT g.*,s.name as subject_name_db FROM grades g LEFT JOIN subjects s ON g.subject_id=s.id $w ORDER BY g.created_at DESC",$p);
    foreach($result['items'] as &$item){if(!empty($item['subject_name_db']))$item['subject_name']=$item['subject_name_db'];unset($item['subject_name_db']);}
    jsonOut($result);
}
if($path==='/grades'&&$method==='POST'){
    $grade=intval($_POST['grade']??0);$cid=intval($_POST['child_id']??1);
    if($grade<1||$grade>5)jsonOut(['error'=>'Invalid'],400);
    $subjectId=intval($_POST['subject_id']??0);if(!$subjectId)jsonOut(['error'=>'No subject'],400);
    $screenshot='';
    if(isset($_FILES['screenshot'])&&$_FILES['screenshot']['error']===UPLOAD_ERR_OK){
        $ext=strtolower(pathinfo($_FILES['screenshot']['name'],PATHINFO_EXTENSION));
        if(in_array($ext,['jpg','jpeg','png','gif','webp'])){
            $fn=bin2hex(random_bytes(8)).'.'.$ext;move_uploaded_file($_FILES['screenshot']['tmp_name'],UPLOAD_DIR.$fn);$screenshot=$fn;
        }
    }
    $price=floatval(getSetting($db,"price_$grade")??0);
    $stmt=$db->prepare("INSERT INTO grades (child_id,grade,grade_label,subject_id,subject_name,screenshot,comment,grade_date,status,amount,school_year) VALUES (:cid,:g,:gl,:si,:sn,:sc,:cm,:gd,'pending',:am,:sy)");
    $stmt->bindValue(':cid',$cid,SQLITE3_INTEGER);$stmt->bindValue(':g',$grade,SQLITE3_INTEGER);
    $stmt->bindValue(':gl',$_POST['grade_label']??(string)$grade);$stmt->bindValue(':si',$subjectId,SQLITE3_INTEGER);
    $stmt->bindValue(':sn',$_POST['subject_name']??'');$stmt->bindValue(':sc',$screenshot);
    $stmt->bindValue(':cm',$_POST['comment']??'');$stmt->bindValue(':gd',$_POST['grade_date']??date('Y-m-d'));
    $stmt->bindValue(':am',$price,SQLITE3_FLOAT);$stmt->bindValue(':sy',$_POST['school_year']??'');$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if(preg_match('#^/grades/(\d+)/review$#',$path,$m)&&$method==='POST'){
    $id=intval($m[1]);$data=getJSON();$status=$data['status']??'';
    if(!in_array($status,['approved','rejected']))jsonOut(['error'=>'Invalid'],400);
    $grade=$db->querySingle("SELECT grade FROM grades WHERE id=$id");
    $amount=($status==='approved')?floatval(getSetting($db,"price_$grade")??0):0;
    $stmt=$db->prepare("UPDATE grades SET status=:s,amount=:a,reviewed_at=datetime('now','localtime') WHERE id=:id");
    $stmt->bindValue(':s',$status);$stmt->bindValue(':a',$amount,SQLITE3_FLOAT);$stmt->bindValue(':id',$id,SQLITE3_INTEGER);$stmt->execute();
    jsonOut(['ok'=>true]);
}

// ---- PAYMENTS (per child) ----
if($path==='/payments'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);$sy=$_GET['school_year']??'';
    $w="WHERE child_id=:cid";$p=[':cid'=>$cid];
    if($sy){$w.=" AND school_year=:sy";$p[':sy']=$sy;}
    jsonOut(paginate($db,"SELECT COUNT(*) FROM payments $w","SELECT * FROM payments $w ORDER BY payment_date DESC,created_at DESC",$p));
}
if($path==='/payments'&&$method==='POST'){
    $data=getJSON();$amt=floatval($data['amount']??0);if($amt<=0)jsonOut(['error'=>'Invalid'],400);
    $cid=intval($data['child_id']??1);
    $stmt=$db->prepare("INSERT INTO payments (child_id,amount,payment_date,note,school_year) VALUES (:cid,:a,:d,:n,:sy)");
    $stmt->bindValue(':cid',$cid,SQLITE3_INTEGER);$stmt->bindValue(':a',$amt,SQLITE3_FLOAT);
    $stmt->bindValue(':d',$data['date']??date('Y-m-d'));$stmt->bindValue(':n',$data['note']??'');
    $stmt->bindValue(':sy',$data['school_year']??'');$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if(preg_match('#^/payments/(\d+)$#',$path,$m)&&$method==='DELETE'){
    $db->exec("DELETE FROM payments WHERE id=".intval($m[1]));jsonOut(['ok'=>true]);
}

// ---- STATS (per child) ----
if($path==='/stats'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);
    $earned=$db->querySingle("SELECT COALESCE(SUM(amount),0) FROM grades WHERE child_id=$cid AND status='approved'");
    $paid=$db->querySingle("SELECT COALESCE(SUM(amount),0) FROM payments WHERE child_id=$cid");
    $counts=[];$r=$db->query("SELECT grade,COUNT(*) as cnt FROM grades WHERE child_id=$cid AND status='approved' GROUP BY grade");
    while($row=$r->fetchArray(SQLITE3_ASSOC))$counts[$row['grade']]=$row['cnt'];
    $pending=$db->querySingle("SELECT COUNT(*) FROM grades WHERE child_id=$cid AND status='pending'");
    $avg=$db->querySingle("SELECT ROUND(AVG(grade),1) FROM grades WHERE child_id=$cid AND status='approved'")??0;
    jsonOut(['balance'=>$earned-$paid,'total_earned'=>$earned,'total_paid'=>$paid,'grade_counts'=>$counts?:(object)[],'pending_count'=>$pending,'avg_grade'=>$avg]);
}

// ---- TODOS (per child) ----
if($path==='/todos'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);
    jsonOut(paginate($db,"SELECT COUNT(*) FROM todos WHERE child_id=:cid","SELECT * FROM todos WHERE child_id=:cid ORDER BY CASE status WHEN 'todo' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,due_date ASC,created_at DESC",[':cid'=>$cid]));
}
if($path==='/todos'&&$method==='POST'){
    $data=getJSON();$title=trim($data['title']??'');if(!$title)jsonOut(['error'=>'Empty'],400);
    $cid=intval($data['child_id']??1);
    $stmt=$db->prepare("INSERT INTO todos (child_id,title,due_date) VALUES (:cid,:t,:d)");
    $stmt->bindValue(':cid',$cid,SQLITE3_INTEGER);$stmt->bindValue(':t',$title);$stmt->bindValue(':d',$data['due_date']??'');$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if(preg_match('#^/todos/(\d+)$#',$path,$m)&&$method==='POST'){
    $id=intval($m[1]);$data=getJSON();$sets=[];$params=[':id'=>$id];
    if(isset($data['title'])){$sets[]="title=:t";$params[':t']=$data['title'];}
    if(isset($data['status'])){$sets[]="status=:s";$params[':s']=$data['status'];
        $sets[]=$data['status']==='done'?"completed_at=datetime('now','localtime')":"completed_at=NULL";}
    if(isset($data['due_date'])){$sets[]="due_date=:d";$params[':d']=$data['due_date'];}
    if(empty($sets))jsonOut(['error'=>'Nothing'],400);
    $stmt=$db->prepare("UPDATE todos SET ".implode(',',$sets)." WHERE id=:id");
    foreach($params as $k=>$v)$stmt->bindValue($k,$v);$stmt->execute();jsonOut(['ok'=>true]);
}
if(preg_match('#^/todos/(\d+)$#',$path,$m)&&$method==='DELETE'){
    $db->exec("DELETE FROM todos WHERE id=".intval($m[1]));jsonOut(['ok'=>true]);
}

// ---- MESSAGES (per child) ----
if($path==='/messages'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);
    jsonOut(paginate($db,"SELECT COUNT(*) FROM messages WHERE child_id=:cid","SELECT * FROM messages WHERE child_id=:cid ORDER BY created_at DESC",[':cid'=>$cid]));
}
if($path==='/messages/unread'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);
    jsonOut(['count'=>$db->querySingle("SELECT COUNT(*) FROM messages WHERE child_id=$cid AND is_read=0")]);
}
if($path==='/messages'&&$method==='POST'){
    $data=getJSON();$text=trim($data['text']??'');if(!$text)jsonOut(['error'=>'Empty'],400);
    $cid=intval($data['child_id']??1);$sender=$data['sender']??'mama';
    if(!in_array($sender,['mama','papa','grandpa','grandma']))$sender='mama';
    $stmt=$db->prepare("INSERT INTO messages (child_id,sender,text) VALUES (:cid,:s,:t)");
    $stmt->bindValue(':cid',$cid,SQLITE3_INTEGER);$stmt->bindValue(':s',$sender);$stmt->bindValue(':t',$text);$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if($path==='/messages/read-all'&&$method==='POST'){
    $data=getJSON();$cid=intval($data['child_id']??1);
    $db->exec("UPDATE messages SET is_read=1 WHERE child_id=$cid AND is_read=0");jsonOut(['ok'=>true]);
}
if(preg_match('#^/messages/(\d+)$#',$path,$m)&&$method==='DELETE'){
    $db->exec("DELETE FROM messages WHERE id=".intval($m[1]));jsonOut(['ok'=>true]);
}

// ---- CLEAR (per child) ----
if($path==='/clear'&&$method==='POST'){
    $data=getJSON();if(($data['confirm']??'')!=='DELETE_ALL')jsonOut(['error'=>'Confirm'],400);
    $cid=intval($data['child_id']??0);
    if($cid>0){
        $db->exec("DELETE FROM grades WHERE child_id=$cid");
        $db->exec("DELETE FROM payments WHERE child_id=$cid");
        $db->exec("DELETE FROM todos WHERE child_id=$cid");
        $db->exec("DELETE FROM messages WHERE child_id=$cid");
    } else {
        $db->exec("DELETE FROM grades");$db->exec("DELETE FROM payments");
        $db->exec("DELETE FROM todos");$db->exec("DELETE FROM messages");
    }
    foreach(glob(UPLOAD_DIR.'*') as $f){if(is_file($f))@unlink($f);}
    jsonOut(['ok'=>true]);
}

// ---- SCHOOL YEARS ----
if($path==='/school-years'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);
    $r=$db->query("SELECT * FROM school_years WHERE child_id=$cid ORDER BY id DESC");$items=[];
    while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;jsonOut($items);
}
if($path==='/school-years'&&$method==='POST'){
    $data=getJSON();$cid=intval($data['child_id']??1);
    $yl=trim($data['year_label']??'');$cn=trim($data['class_name']??'');$ic=intval($data['is_current']??0);
    if(!$yl)jsonOut(['error'=>'Empty'],400);
    if($ic)$db->exec("UPDATE school_years SET is_current=0 WHERE child_id=$cid");
    $stmt=$db->prepare("INSERT INTO school_years (child_id,year_label,class_name,is_current) VALUES (:cid,:yl,:cn,:ic)");
    $stmt->bindValue(':cid',$cid);$stmt->bindValue(':yl',$yl);$stmt->bindValue(':cn',$cn);$stmt->bindValue(':ic',$ic);$stmt->execute();
    jsonOut(['ok'=>true,'id'=>$db->lastInsertRowID()]);
}
if(preg_match('#^/school-years/(\d+)/activate$#',$path,$m)&&$method==='POST'){
    $id=intval($m[1]);$data=getJSON();$cid=intval($data['child_id']??1);
    $db->exec("UPDATE school_years SET is_current=0 WHERE child_id=$cid");
    $db->exec("UPDATE school_years SET is_current=1 WHERE id=$id");jsonOut(['ok'=>true]);
}
if(preg_match('#^/school-years/(\d+)$#',$path,$m)&&$method==='DELETE'){
    $db->exec("DELETE FROM school_years WHERE id=".intval($m[1]));jsonOut(['ok'=>true]);
}

// ---- BACKUP / RESTORE ----
if($path==='/backup'&&$method==='GET'){
    $cid=intval($_GET['child_id']??0);
    $backup=['version'=>'v4','date'=>date('Y-m-d H:i:s'),'child_id'=>$cid];
    if($cid>0){
        // Single child backup
        $backup['child']=$db->prepare("SELECT * FROM children WHERE id=:id")->bindValue(':id',$cid)?:null;
        $stmt=$db->prepare("SELECT * FROM children WHERE id=:id");$stmt->bindValue(':id',$cid);
        $backup['child']=$stmt->execute()->fetchArray(SQLITE3_ASSOC);
        foreach(['grades','payments','todos','messages'] as $tbl){
            $r=$db->query("SELECT * FROM $tbl WHERE child_id=$cid");$items=[];
            while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;$backup[$tbl]=$items;
        }
        $r=$db->query("SELECT * FROM school_years WHERE child_id=$cid");$items=[];
        while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;$backup['school_years']=$items;
    } else {
        // Full backup
        foreach(['children','grades','payments','todos','messages','school_years'] as $tbl){
            $r=$db->query("SELECT * FROM $tbl");$items=[];
            while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;$backup[$tbl]=$items;
        }
        $r=$db->query("SELECT * FROM settings");$s=[];
        while($row=$r->fetchArray(SQLITE3_ASSOC))$s[$row['key']]=$row['value'];$backup['settings']=$s;
        $r=$db->query("SELECT * FROM subjects");$items=[];
        while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;$backup['subjects']=$items;
    }
    header('Content-Disposition: attachment; filename="school-rewards-backup-'.date('Y-m-d').($cid?"-child$cid":'').'.json"');
    jsonOut($backup);
}
if($path==='/restore'&&$method==='POST'){
    $data=getJSON();if(!isset($data['version']))jsonOut(['error'=>'Invalid backup'],400);
    $cid=intval($data['child_id']??0);
    if($cid>0&&isset($data['child'])){
        // Restore single child
        $db->exec("DELETE FROM grades WHERE child_id=$cid");
        $db->exec("DELETE FROM payments WHERE child_id=$cid");
        $db->exec("DELETE FROM todos WHERE child_id=$cid");
        $db->exec("DELETE FROM messages WHERE child_id=$cid");
        $db->exec("DELETE FROM school_years WHERE child_id=$cid");
        foreach($data['grades']??[] as $r){$db->exec("INSERT INTO grades (child_id,grade,grade_label,subject_id,subject_name,comment,grade_date,status,amount,school_year,created_at,reviewed_at) VALUES ($cid,{$r['grade']},'".SQLite3::escapeString($r['grade_label']??'')."',{$r['subject_id']},'".SQLite3::escapeString($r['subject_name']??'')."','".SQLite3::escapeString($r['comment']??'')."','".SQLite3::escapeString($r['grade_date']??'')."','".SQLite3::escapeString($r['status']??'pending')."',{$r['amount']},'".SQLite3::escapeString($r['school_year']??'')."','".SQLite3::escapeString($r['created_at']??'')."','".SQLite3::escapeString($r['reviewed_at']??'')."')");}
        foreach($data['payments']??[] as $r){$db->exec("INSERT INTO payments (child_id,amount,payment_date,note,school_year,created_at) VALUES ($cid,{$r['amount']},'".SQLite3::escapeString($r['payment_date'])."','".SQLite3::escapeString($r['note']??'')."','".SQLite3::escapeString($r['school_year']??'')."','".SQLite3::escapeString($r['created_at']??'')."')");}
        foreach($data['todos']??[] as $r){$db->exec("INSERT INTO todos (child_id,title,status,due_date,created_at) VALUES ($cid,'".SQLite3::escapeString($r['title'])."','".SQLite3::escapeString($r['status']??'todo')."','".SQLite3::escapeString($r['due_date']??'')."','".SQLite3::escapeString($r['created_at']??'')."')");}
        foreach($data['messages']??[] as $r){$db->exec("INSERT INTO messages (child_id,sender,text,is_read,created_at) VALUES ($cid,'".SQLite3::escapeString($r['sender']??'mama')."','".SQLite3::escapeString($r['text'])."',{$r['is_read']},'".SQLite3::escapeString($r['created_at']??'')."')");}
        foreach($data['school_years']??[] as $r){$db->exec("INSERT INTO school_years (child_id,year_label,class_name,is_current) VALUES ($cid,'".SQLite3::escapeString($r['year_label'])."','".SQLite3::escapeString($r['class_name']??'')."',{$r['is_current']})");}
    }
    jsonOut(['ok'=>true]);
}

// ---- TODOS for today (used by child dashboard) ----
if($path==='/todos/today'&&$method==='GET'){
    $cid=intval($_GET['child_id']??1);$today=date('Y-m-d');
    $r=$db->query("SELECT * FROM todos WHERE child_id=$cid AND due_date='$today' AND status!='done' ORDER BY created_at LIMIT 3");
    $items=[];while($row=$r->fetchArray(SQLITE3_ASSOC))$items[]=$row;jsonOut($items);
}

// ---- DEBUG ----
if($path==='/debug'&&$method==='GET'){
    jsonOut(['status'=>'ok','php'=>PHP_VERSION,'sqlite3'=>class_exists('SQLite3'),'db_exists'=>file_exists(DB_PATH),'db_writable'=>is_writable(dirname(DB_PATH)),'path'=>$path,'uri'=>$_SERVER['REQUEST_URI']]);
}

jsonOut(['error'=>'Not found','path'=>$path],404);
}catch(Throwable $e){
    if(!headers_sent()){header('Content-Type: application/json; charset=utf-8');http_response_code(500);}
    echo json_encode(['error'=>$e->getMessage(),'file'=>basename($e->getFile()),'line'=>$e->getLine()],JSON_UNESCAPED_UNICODE);
}
