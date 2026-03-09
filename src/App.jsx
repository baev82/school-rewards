import { useState, useEffect, useRef } from "react";

const LOCALES = {
  ru: { name:"Русский",flag:"🇷🇺",dir:"ltr",currency:"₽",grades:[{value:5,label:"5",dp:100},{value:4,label:"4",dp:40},{value:3,label:"3",dp:-30},{value:2,label:"2",dp:-100}],defaultSubjects:["Математика","Русский язык","Литература","Английский язык","Окружающий мир","Физкультура","Музыка","ИЗО","Технология","Информатика","История","Биология","География","Физика","Химия"],defaultChild:"София",
    ui:{appTitle:"Школьные награды",enterPin:"Введите PIN-код",wrongPin:"Неверный PIN-код",yourBalance:"Твой баланс",earned:"Заработано",paid:"Выплачено",addGrade:"Добавить оценку",whatGrade:"Какую оценку получил(а)?",subject:"Предмет",selectSubject:"Выбери предмет...",screenshot:"Скриншот",uploadPhoto:"Нажми чтобы загрузить",comment:"Комментарий",commentPh:"Контрольная, домашняя...",sendReview:"Отправить на проверку",sent:"Отправлено на проверку! ✨",history:"История",payments:"Выплаты",prices:"Тарифы",gradePrices:"Стоимость оценок",noGrades:"Пока нет оценок",noPay:"Пока нет выплат",totalPaid:"Всего выплачено",grade:"Оценка",admin:"Админка",child:"Дитя",logout:"Выход",childBal:"Баланс ребёнка",review:"Проверка",allChecked:"Всё проверено!",confirmed:"Подтверждено ✅",rejected:"Отклонено",makePay:"Сделать выплату",amount:"Сумма",date:"Дата",note:"Заметка",notePh:"За что, за какой период...",payBtn:"Выплатить",payOk:"Выплата записана! 💰",payHistory:"История выплат",noPayYet:"Выплат ещё не было",delPay:"Удалить выплату?",deleted:"Удалено",allGrades:"Все оценки",noGradesYet:"Оценок пока нет",subjects:"Предметы",subjMgmt:"Управление предметами",newSubjPh:"Новый предмет...",added:"Добавлено",cantDel:"Нельзя удалить — есть оценки.",delSubj:"Удалить?",settings:"Настройки",main:"Основные",childName:"Имя ребёнка",pinChild:"PIN ребёнка",pinParent:"PIN родителя",theme:"Тема",girl:"Девочка",boy:"Мальчик",lang:"Язык",save:"Сохранить",saved:"Сохранено ✅",selGrade:"Выбери оценку!",selSubj:"Выбери предмет!",enterAmt:"Укажите сумму",pending:"На проверке",approved:"Подтверждено",rejStatus:"Отклонено",resetSubj:"Сбросить предметы",forGrade:g=>`За ${g}`,
      gl:["Пятёрок","Четвёрок","Троек","Двоек"],motGreat:(n,a)=>`🎉 Отличная работа, ${n}! Средний балл: ${a}`,motGood:(n,a)=>`💪 Хорошо, ${n}! Балл: ${a}. Так держать!`,motOk:(n,a)=>`📚 ${n}, ты справишься! Балл: ${a}`}},
  en: { name:"English",flag:"🇺🇸",dir:"ltr",currency:"$",grades:[{value:5,label:"A",dp:10},{value:4,label:"B",dp:5},{value:3,label:"C",dp:-3},{value:2,label:"D",dp:-5},{value:1,label:"F",dp:-10}],defaultSubjects:["Math","English","Science","Social Studies","Art","Music","PE","Computer Science","History","Geography","Biology","Chemistry","Physics","Foreign Language"],defaultChild:"Sophie",
    ui:{appTitle:"School Rewards",enterPin:"Enter PIN",wrongPin:"Wrong PIN",yourBalance:"Your Balance",earned:"Earned",paid:"Paid Out",addGrade:"Add Grade",whatGrade:"What grade did you get?",subject:"Subject",selectSubject:"Select subject...",screenshot:"Screenshot",uploadPhoto:"Tap to upload photo",comment:"Comment",commentPh:"Test, homework...",sendReview:"Send for Review",sent:"Sent for review! ✨",history:"History",payments:"Payments",prices:"Rates",gradePrices:"Grade Prices",noGrades:"No grades yet",noPay:"No payments yet",totalPaid:"Total Paid",grade:"Grade",admin:"Admin",child:"Child",logout:"Logout",childBal:"Child's Balance",review:"Review",allChecked:"All reviewed!",confirmed:"Confirmed ✅",rejected:"Rejected",makePay:"Make Payment",amount:"Amount",date:"Date",note:"Note",notePh:"For what period...",payBtn:"Pay",payOk:"Payment recorded! 💰",payHistory:"Payment History",noPayYet:"No payments yet",delPay:"Delete payment?",deleted:"Deleted",allGrades:"All Grades",noGradesYet:"No grades yet",subjects:"Subjects",subjMgmt:"Manage Subjects",newSubjPh:"New subject...",added:"Added",cantDel:"Can't delete — has grades.",delSubj:"Delete?",settings:"Settings",main:"General",childName:"Child's Name",pinChild:"Child PIN",pinParent:"Parent PIN",theme:"Theme",girl:"Girl",boy:"Boy",lang:"Language",save:"Save Settings",saved:"Saved ✅",selGrade:"Select a grade!",selSubj:"Select a subject!",enterAmt:"Enter amount",pending:"Pending",approved:"Approved",rejStatus:"Rejected",resetSubj:"Reset subjects",forGrade:g=>`For ${g}`,
      gl:["A's","B's","C's","D's"],motGreat:(n,a)=>`🎉 Great job, ${n}! Average: ${a}`,motGood:(n,a)=>`💪 Good, ${n}! Average: ${a}. Keep it up!`,motOk:(n,a)=>`📚 You can do it, ${n}! Average: ${a}`}},
  zh: { name:"中文",flag:"🇨🇳",dir:"ltr",currency:"¥",grades:[{value:5,label:"优(90+)",dp:50},{value:4,label:"良(80-89)",dp:20},{value:3,label:"中(70-79)",dp:-10},{value:2,label:"差(60-69)",dp:-30},{value:1,label:"不及格",dp:-50}],defaultSubjects:["数学","语文","英语","物理","化学","生物","历史","地理","政治","体育","音乐","美术","信息技术"],defaultChild:"小明",
    ui:{appTitle:"学习奖励",enterPin:"请输入PIN码",wrongPin:"PIN码错误",yourBalance:"你的余额",earned:"已赚取",paid:"已支付",addGrade:"添加成绩",whatGrade:"你得了什么成绩？",subject:"科目",selectSubject:"选择科目...",screenshot:"截图",uploadPhoto:"点击上传照片",comment:"备注",commentPh:"考试、作业...",sendReview:"提交审核",sent:"已提交审核！✨",history:"历史",payments:"支付记录",prices:"价格表",gradePrices:"成绩价格",noGrades:"暂无成绩",noPay:"暂无支付",totalPaid:"总支付",grade:"成绩",admin:"管理",child:"孩子",logout:"退出",childBal:"孩子余额",review:"审核",allChecked:"全部审核完毕！",confirmed:"已确认 ✅",rejected:"已拒绝",makePay:"进行支付",amount:"金额",date:"日期",note:"备注",notePh:"用于什么...",payBtn:"支付",payOk:"已记录！💰",payHistory:"支付历史",noPayYet:"暂无支付",delPay:"删除此支付？",deleted:"已删除",allGrades:"所有成绩",noGradesYet:"暂无成绩",subjects:"科目",subjMgmt:"科目管理",newSubjPh:"新科目...",added:"已添加",cantDel:"无法删除，已有成绩。",delSubj:"删除？",settings:"设置",main:"基本设置",childName:"孩子姓名",pinChild:"孩子PIN",pinParent:"家长PIN",theme:"主题",girl:"女孩",boy:"男孩",lang:"语言",save:"保存设置",saved:"已保存 ✅",selGrade:"请选择成绩！",selSubj:"请选择科目！",enterAmt:"请输入金额",pending:"待审核",approved:"已通过",rejStatus:"已拒绝",resetSubj:"重置科目",forGrade:g=>`${g}的价格`,
      gl:["优","良","中","差"],motGreat:(n,a)=>`🎉 太棒了，${n}！平均分：${a}`,motGood:(n,a)=>`💪 不错，${n}！平均：${a}`,motOk:(n,a)=>`📚 ${n}，加油！平均：${a}`}},
  hi: { name:"हिन्दी",flag:"🇮🇳",dir:"ltr",currency:"₹",grades:[{value:5,label:"A+(90%+)",dp:500},{value:4,label:"A(80-89%)",dp:200},{value:3,label:"B(60-79%)",dp:-100},{value:2,label:"C(40-59%)",dp:-300},{value:1,label:"F(<40%)",dp:-500}],defaultSubjects:["गणित","हिन्दी","अंग्रेज़ी","विज्ञान","सामाजिक विज्ञान","कंप्यूटर","कला","संगीत","शारीरिक शिक्षा"],defaultChild:"आर्या",
    ui:{appTitle:"स्कूल पुरस्कार",enterPin:"PIN दर्ज करें",wrongPin:"गलत PIN",yourBalance:"आपका बैलेंस",earned:"कमाया",paid:"भुगतान",addGrade:"ग्रेड जोड़ें",whatGrade:"कौन सा ग्रेड मिला?",subject:"विषय",selectSubject:"विषय चुनें...",screenshot:"स्क्रीनशॉट",uploadPhoto:"फोटो अपलोड करें",comment:"टिप्पणी",commentPh:"परीक्षा, होमवर्क...",sendReview:"समीक्षा के लिए भेजें",sent:"भेजा गया! ✨",history:"इतिहास",payments:"भुगतान",prices:"दरें",gradePrices:"ग्रेड की कीमतें",noGrades:"कोई ग्रेड नहीं",noPay:"कोई भुगतान नहीं",totalPaid:"कुल भुगतान",grade:"ग्रेड",admin:"एडमिन",child:"बच्चा",logout:"लॉगआउट",childBal:"बच्चे का बैलेंस",review:"समीक्षा",allChecked:"सब जाँच हो गई!",confirmed:"पुष्टि ✅",rejected:"अस्वीकृत",makePay:"भुगतान करें",amount:"राशि",date:"तारीख",note:"नोट",notePh:"किसके लिए...",payBtn:"भुगतान",payOk:"भुगतान दर्ज! 💰",payHistory:"भुगतान इतिहास",noPayYet:"कोई भुगतान नहीं",delPay:"यह भुगतान हटाएँ?",deleted:"हटाया गया",allGrades:"सभी ग्रेड",noGradesYet:"कोई ग्रेड नहीं",subjects:"विषय",subjMgmt:"विषय प्रबंधन",newSubjPh:"नया विषय...",added:"जोड़ा गया",cantDel:"हटा नहीं सकते।",delSubj:"हटाएँ?",settings:"सेटिंग्स",main:"मुख्य",childName:"बच्चे का नाम",pinChild:"बच्चे का PIN",pinParent:"माता-पिता PIN",theme:"थीम",girl:"लड़की",boy:"लड़का",lang:"भाषा",save:"सहेजें",saved:"सहेजा ✅",selGrade:"ग्रेड चुनें!",selSubj:"विषय चुनें!",enterAmt:"राशि दर्ज करें",pending:"लंबित",approved:"मंजूर",rejStatus:"अस्वीकृत",resetSubj:"विषय रीसेट",forGrade:g=>`${g} के लिए`,
      gl:["A+","A","B","C"],motGreat:(n,a)=>`🎉 शानदार, ${n}! औसत: ${a}`,motGood:(n,a)=>`💪 अच्छा, ${n}! औसत: ${a}`,motOk:(n,a)=>`📚 ${n}, तुम कर सकते हो! औसत: ${a}`}},
  es: { name:"Español",flag:"🇪🇸",dir:"ltr",currency:"€",grades:[{value:5,label:"Sobresaliente",dp:10},{value:4,label:"Notable",dp:5},{value:3,label:"Bien",dp:-2},{value:2,label:"Suficiente",dp:-5},{value:1,label:"Insuficiente",dp:-10}],defaultSubjects:["Matemáticas","Lengua","Inglés","Ciencias","Sociales","Ed. Física","Música","Plástica","Tecnología"],defaultChild:"Sofía",
    ui:{appTitle:"Recompensas Escolares",enterPin:"Introduce el PIN",wrongPin:"PIN incorrecto",yourBalance:"Tu Saldo",earned:"Ganado",paid:"Pagado",addGrade:"Añadir Nota",whatGrade:"¿Qué nota sacaste?",subject:"Asignatura",selectSubject:"Elige asignatura...",screenshot:"Captura",uploadPhoto:"Pulsa para subir",comment:"Comentario",commentPh:"Examen, deberes...",sendReview:"Enviar a revisión",sent:"¡Enviado! ✨",history:"Historial",payments:"Pagos",prices:"Tarifas",gradePrices:"Precio por Nota",noGrades:"Sin notas",noPay:"Sin pagos",totalPaid:"Total Pagado",grade:"Nota",admin:"Admin",child:"Niño/a",logout:"Salir",childBal:"Saldo del Niño",review:"Revisar",allChecked:"¡Todo revisado!",confirmed:"Confirmado ✅",rejected:"Rechazado",makePay:"Realizar Pago",amount:"Cantidad",date:"Fecha",note:"Nota",notePh:"Por qué periodo...",payBtn:"Pagar",payOk:"¡Pago registrado! 💰",payHistory:"Historial de Pagos",noPayYet:"Sin pagos",delPay:"¿Eliminar pago?",deleted:"Eliminado",allGrades:"Todas las Notas",noGradesYet:"Sin notas",subjects:"Asignaturas",subjMgmt:"Gestión de Asignaturas",newSubjPh:"Nueva asignatura...",added:"Añadido",cantDel:"No se puede — tiene notas.",delSubj:"¿Eliminar?",settings:"Ajustes",main:"General",childName:"Nombre",pinChild:"PIN Niño",pinParent:"PIN Padre",theme:"Tema",girl:"Chica",boy:"Chico",lang:"Idioma",save:"Guardar",saved:"Guardado ✅",selGrade:"¡Elige nota!",selSubj:"¡Elige asignatura!",enterAmt:"Indica cantidad",pending:"Pendiente",approved:"Aprobado",rejStatus:"Rechazado",resetSubj:"Resetear asignaturas",forGrade:g=>`Por ${g}`,
      gl:["Sobres.","Notables","Bienes","Sufic."],motGreat:(n,a)=>`🎉 ¡Excelente, ${n}! Media: ${a}`,motGood:(n,a)=>`💪 ¡Bien, ${n}! Media: ${a}`,motOk:(n,a)=>`📚 ¡Tú puedes, ${n}! Media: ${a}`}},
  ar: { name:"العربية",flag:"🇸🇦",dir:"rtl",currency:"ر.س",grades:[{value:5,label:"ممتاز(90+)",dp:50},{value:4,label:"جيد جداً(80)",dp:20},{value:3,label:"جيد(70)",dp:-10},{value:2,label:"مقبول(60)",dp:-30},{value:1,label:"راسب",dp:-50}],defaultSubjects:["الرياضيات","اللغة العربية","الإنجليزية","العلوم","الاجتماعيات","التربية الإسلامية","الحاسب","التربية البدنية","الفنية"],defaultChild:"سارة",
    ui:{appTitle:"مكافآت المدرسة",enterPin:"أدخل PIN",wrongPin:"PIN خاطئ",yourBalance:"رصيدك",earned:"مكتسب",paid:"مدفوع",addGrade:"إضافة درجة",whatGrade:"ما الدرجة؟",subject:"المادة",selectSubject:"اختر المادة...",screenshot:"لقطة شاشة",uploadPhoto:"انقر للرفع",comment:"تعليق",commentPh:"اختبار، واجب...",sendReview:"إرسال للمراجعة",sent:"تم الإرسال! ✨",history:"السجل",payments:"المدفوعات",prices:"الأسعار",gradePrices:"أسعار الدرجات",noGrades:"لا درجات",noPay:"لا مدفوعات",totalPaid:"إجمالي المدفوع",grade:"درجة",admin:"الإدارة",child:"الطفل",logout:"خروج",childBal:"رصيد الطفل",review:"مراجعة",allChecked:"تمت المراجعة!",confirmed:"تم التأكيد ✅",rejected:"مرفوض",makePay:"إجراء دفع",amount:"المبلغ",date:"التاريخ",note:"ملاحظة",notePh:"لأي فترة...",payBtn:"دفع",payOk:"تم! 💰",payHistory:"سجل المدفوعات",noPayYet:"لا مدفوعات",delPay:"حذف الدفع؟",deleted:"تم الحذف",allGrades:"جميع الدرجات",noGradesYet:"لا درجات",subjects:"المواد",subjMgmt:"إدارة المواد",newSubjPh:"مادة جديدة...",added:"تمت الإضافة",cantDel:"لا يمكن الحذف.",delSubj:"حذف؟",settings:"الإعدادات",main:"عام",childName:"اسم الطفل",pinChild:"PIN الطفل",pinParent:"PIN الوالد",theme:"المظهر",girl:"بنت",boy:"ولد",lang:"اللغة",save:"حفظ",saved:"تم الحفظ ✅",selGrade:"اختر درجة!",selSubj:"اختر مادة!",enterAmt:"أدخل المبلغ",pending:"قيد المراجعة",approved:"مقبول",rejStatus:"مرفوض",resetSubj:"إعادة تعيين المواد",forGrade:g=>`لدرجة ${g}`,
      gl:["ممتاز","جيد جداً","جيد","مقبول"],motGreat:(n,a)=>`🎉 ممتاز يا ${n}! المعدل: ${a}`,motGood:(n,a)=>`💪 جيد يا ${n}! المعدل: ${a}`,motOk:(n,a)=>`📚 ${n}، يمكنك! المعدل: ${a}`}},
  fr: { name:"Français",flag:"🇫🇷",dir:"ltr",currency:"€",grades:[{value:5,label:"Très bien(16+)",dp:10},{value:4,label:"Bien(14-15)",dp:5},{value:3,label:"Assez bien(12)",dp:-2},{value:2,label:"Passable(10)",dp:-5},{value:1,label:"Insuffisant",dp:-10}],defaultSubjects:["Mathématiques","Français","Anglais","Histoire-Géo","SVT","Physique-Chimie","EPS","Arts","Musique","Technologie"],defaultChild:"Sophie",
    ui:{appTitle:"Récompenses Scolaires",enterPin:"Entrez le PIN",wrongPin:"PIN incorrect",yourBalance:"Ton Solde",earned:"Gagné",paid:"Payé",addGrade:"Ajouter Note",whatGrade:"Quelle note ?",subject:"Matière",selectSubject:"Choisis...",screenshot:"Capture",uploadPhoto:"Appuie pour télécharger",comment:"Commentaire",commentPh:"Contrôle, devoir...",sendReview:"Envoyer",sent:"Envoyé ! ✨",history:"Historique",payments:"Paiements",prices:"Tarifs",gradePrices:"Prix des Notes",noGrades:"Pas de notes",noPay:"Pas de paiements",totalPaid:"Total Payé",grade:"Note",admin:"Admin",child:"Enfant",logout:"Déconnexion",childBal:"Solde Enfant",review:"Vérifier",allChecked:"Tout vérifié !",confirmed:"Confirmé ✅",rejected:"Refusé",makePay:"Paiement",amount:"Montant",date:"Date",note:"Note",notePh:"Pour quelle période...",payBtn:"Payer",payOk:"Enregistré ! 💰",payHistory:"Historique Paiements",noPayYet:"Aucun paiement",delPay:"Supprimer ?",deleted:"Supprimé",allGrades:"Toutes les Notes",noGradesYet:"Aucune note",subjects:"Matières",subjMgmt:"Gestion Matières",newSubjPh:"Nouvelle matière...",added:"Ajouté",cantDel:"Impossible — notes existent.",delSubj:"Supprimer ?",settings:"Paramètres",main:"Général",childName:"Nom Enfant",pinChild:"PIN Enfant",pinParent:"PIN Parent",theme:"Thème",girl:"Fille",boy:"Garçon",lang:"Langue",save:"Sauvegarder",saved:"Sauvegardé ✅",selGrade:"Choisis note !",selSubj:"Choisis matière !",enterAmt:"Montant ?",pending:"En attente",approved:"Approuvé",rejStatus:"Refusé",resetSubj:"Réinitialiser matières",forGrade:g=>`Pour ${g}`,
      gl:["Très bien","Bien","Assez bien","Passable"],motGreat:(n,a)=>`🎉 Excellent, ${n} ! Moyenne: ${a}`,motGood:(n,a)=>`💪 Bien, ${n} ! Moyenne: ${a}`,motOk:(n,a)=>`📚 Tu peux, ${n} ! Moyenne: ${a}`}},
  bn: { name:"বাংলা",flag:"🇧🇩",dir:"ltr",currency:"৳",grades:[{value:5,label:"A+(5.0)",dp:500},{value:4,label:"A(4.0)",dp:200},{value:3,label:"B(3.0)",dp:-100},{value:2,label:"C(2.0)",dp:-300},{value:1,label:"F(0)",dp:-500}],defaultSubjects:["গণিত","বাংলা","ইংরেজি","বিজ্ঞান","সমাজবিদ্যা","ধর্ম","শারীরিক শিক্ষা","চারু কলা","কম্পিউটার"],defaultChild:"তানিয়া",
    ui:{appTitle:"স্কুল পুরস্কার",enterPin:"PIN দিন",wrongPin:"ভুল PIN",yourBalance:"ব্যালেন্স",earned:"অর্জিত",paid:"প্রদত্ত",addGrade:"গ্রেড যোগ",whatGrade:"কী গ্রেড?",subject:"বিষয়",selectSubject:"বিষয় বাছাই...",screenshot:"স্ক্রিনশট",uploadPhoto:"আপলোড করুন",comment:"মন্তব্য",commentPh:"পরীক্ষা, বাড়ির কাজ...",sendReview:"পাঠান",sent:"পাঠানো হয়েছে! ✨",history:"ইতিহাস",payments:"পেমেন্ট",prices:"দর",gradePrices:"গ্রেড মূল্য",noGrades:"কোনো গ্রেড নেই",noPay:"কোনো পেমেন্ট নেই",totalPaid:"মোট প্রদত্ত",grade:"গ্রেড",admin:"অ্যাডমিন",child:"শিশু",logout:"লগআউট",childBal:"শিশুর ব্যালেন্স",review:"পর্যালোচনা",allChecked:"সব হয়েছে!",confirmed:"নিশ্চিত ✅",rejected:"প্রত্যাখ্যাত",makePay:"পেমেন্ট",amount:"পরিমাণ",date:"তারিখ",note:"নোট",notePh:"কিসের জন্য...",payBtn:"পেমেন্ট",payOk:"রেকর্ড! 💰",payHistory:"পেমেন্ট ইতিহাস",noPayYet:"নেই",delPay:"মুছবেন?",deleted:"মোছা হয়েছে",allGrades:"সব গ্রেড",noGradesYet:"নেই",subjects:"বিষয়",subjMgmt:"বিষয় ব্যবস্থাপনা",newSubjPh:"নতুন বিষয়...",added:"যোগ হয়েছে",cantDel:"মোছা যাবে না।",delSubj:"মুছবেন?",settings:"সেটিংস",main:"প্রধান",childName:"নাম",pinChild:"শিশু PIN",pinParent:"অভিভাবক PIN",theme:"থিম",girl:"মেয়ে",boy:"ছেলে",lang:"ভাষা",save:"সংরক্ষণ",saved:"সংরক্ষিত ✅",selGrade:"গ্রেড বাছুন!",selSubj:"বিষয় বাছুন!",enterAmt:"পরিমাণ দিন",pending:"মুলতুবি",approved:"অনুমোদিত",rejStatus:"প্রত্যাখ্যাত",resetSubj:"রীসেট",forGrade:g=>`${g} এর জন্য`,
      gl:["A+","A","B","C"],motGreat:(n,a)=>`🎉 অসাধারণ, ${n}! গড়: ${a}`,motGood:(n,a)=>`💪 ভালো, ${n}! গড়: ${a}`,motOk:(n,a)=>`📚 ${n}, পারবে! গড়: ${a}`}},
  pt: { name:"Português",flag:"🇧🇷",dir:"ltr",currency:"R$",grades:[{value:5,label:"Excelente(9-10)",dp:20},{value:4,label:"Bom(7-8)",dp:10},{value:3,label:"Regular(5-6)",dp:-5},{value:2,label:"Insuf.(3-4)",dp:-10},{value:1,label:"Péssimo(0-2)",dp:-20}],defaultSubjects:["Matemática","Português","Inglês","Ciências","História","Geografia","Ed. Física","Artes","Informática"],defaultChild:"Sofia",
    ui:{appTitle:"Recompensas Escolares",enterPin:"Digite o PIN",wrongPin:"PIN incorreto",yourBalance:"Seu Saldo",earned:"Ganho",paid:"Pago",addGrade:"Adicionar Nota",whatGrade:"Que nota?",subject:"Matéria",selectSubject:"Escolha...",screenshot:"Captura",uploadPhoto:"Enviar foto",comment:"Comentário",commentPh:"Prova, lição...",sendReview:"Enviar",sent:"Enviado! ✨",history:"Histórico",payments:"Pagamentos",prices:"Valores",gradePrices:"Valor das Notas",noGrades:"Sem notas",noPay:"Sem pagamentos",totalPaid:"Total Pago",grade:"Nota",admin:"Admin",child:"Filho/a",logout:"Sair",childBal:"Saldo Criança",review:"Revisar",allChecked:"Tudo revisado!",confirmed:"Confirmado ✅",rejected:"Rejeitado",makePay:"Pagamento",amount:"Valor",date:"Data",note:"Obs.",notePh:"Referente a...",payBtn:"Pagar",payOk:"Registrado! 💰",payHistory:"Histórico",noPayYet:"Sem pagamentos",delPay:"Excluir?",deleted:"Excluído",allGrades:"Todas Notas",noGradesYet:"Sem notas",subjects:"Matérias",subjMgmt:"Gerenciar",newSubjPh:"Nova matéria...",added:"Adicionado",cantDel:"Não pode — tem notas.",delSubj:"Excluir?",settings:"Configurações",main:"Geral",childName:"Nome",pinChild:"PIN Criança",pinParent:"PIN Pais",theme:"Tema",girl:"Menina",boy:"Menino",lang:"Idioma",save:"Salvar",saved:"Salvo ✅",selGrade:"Escolha nota!",selSubj:"Escolha matéria!",enterAmt:"Informe valor",pending:"Pendente",approved:"Aprovado",rejStatus:"Rejeitado",resetSubj:"Resetar matérias",forGrade:g=>`Por ${g}`,
      gl:["Excelente","Bom","Regular","Insuf."],motGreat:(n,a)=>`🎉 Excelente, ${n}! Média: ${a}`,motGood:(n,a)=>`💪 Bom, ${n}! Média: ${a}`,motOk:(n,a)=>`📚 Você consegue, ${n}! Média: ${a}`}},
  it: { name:"Italiano",flag:"🇮🇹",dir:"ltr",currency:"€",grades:[{value:5,label:"Ottimo(9-10)",dp:10},{value:4,label:"Buono(7-8)",dp:5},{value:3,label:"Suff.(6)",dp:-2},{value:2,label:"Insuff.(4-5)",dp:-5},{value:1,label:"Grav.Insuff.",dp:-10}],defaultSubjects:["Matematica","Italiano","Inglese","Scienze","Storia","Geografia","Ed. Fisica","Arte","Musica","Tecnologia"],defaultChild:"Sofia",
    ui:{appTitle:"Premi Scolastici",enterPin:"Inserisci PIN",wrongPin:"PIN errato",yourBalance:"Il Tuo Saldo",earned:"Guadagnato",paid:"Pagato",addGrade:"Aggiungi Voto",whatGrade:"Che voto?",subject:"Materia",selectSubject:"Scegli...",screenshot:"Screenshot",uploadPhoto:"Carica foto",comment:"Commento",commentPh:"Verifica, compito...",sendReview:"Invia",sent:"Inviato! ✨",history:"Cronologia",payments:"Pagamenti",prices:"Tariffe",gradePrices:"Prezzo Voti",noGrades:"Nessun voto",noPay:"Nessun pagamento",totalPaid:"Totale Pagato",grade:"Voto",admin:"Admin",child:"Figlio/a",logout:"Esci",childBal:"Saldo Bambino",review:"Revisione",allChecked:"Tutto fatto!",confirmed:"Confermato ✅",rejected:"Rifiutato",makePay:"Pagamento",amount:"Importo",date:"Data",note:"Note",notePh:"Per cosa...",payBtn:"Paga",payOk:"Registrato! 💰",payHistory:"Cronologia",noPayYet:"Nessun pagamento",delPay:"Eliminare?",deleted:"Eliminato",allGrades:"Tutti i Voti",noGradesYet:"Nessun voto",subjects:"Materie",subjMgmt:"Gestione",newSubjPh:"Nuova materia...",added:"Aggiunto",cantDel:"Non eliminabile.",delSubj:"Eliminare?",settings:"Impostazioni",main:"Generali",childName:"Nome",pinChild:"PIN Bambino",pinParent:"PIN Genitore",theme:"Tema",girl:"Ragazza",boy:"Ragazzo",lang:"Lingua",save:"Salva",saved:"Salvato ✅",selGrade:"Scegli voto!",selSubj:"Scegli materia!",enterAmt:"Importo?",pending:"In attesa",approved:"Approvato",rejStatus:"Rifiutato",resetSubj:"Reset materie",forGrade:g=>`Per ${g}`,
      gl:["Ottimo","Buono","Suff.","Insuff."],motGreat:(n,a)=>`🎉 Ottimo, ${n}! Media: ${a}`,motGood:(n,a)=>`💪 Bravo, ${n}! Media: ${a}`,motOk:(n,a)=>`📚 Ce la fai, ${n}! Media: ${a}`}},
  ja: { name:"日本語",flag:"🇯🇵",dir:"ltr",currency:"¥",grades:[{value:5,label:"5(秀)",dp:1000},{value:4,label:"4(優)",dp:500},{value:3,label:"3(良)",dp:-200},{value:2,label:"2(可)",dp:-500},{value:1,label:"1(不可)",dp:-1000}],defaultSubjects:["算数","国語","英語","理科","社会","体育","音楽","図工","家庭科","道徳"],defaultChild:"さくら",
    ui:{appTitle:"学校ごほうび",enterPin:"PINを入力",wrongPin:"PINが違います",yourBalance:"残高",earned:"獲得",paid:"支払済",addGrade:"成績追加",whatGrade:"何の成績？",subject:"教科",selectSubject:"教科を選択...",screenshot:"スクリーンショット",uploadPhoto:"写真アップロード",comment:"コメント",commentPh:"テスト、宿題...",sendReview:"確認に送る",sent:"送信しました！✨",history:"履歴",payments:"支払い",prices:"料金表",gradePrices:"成績の価格",noGrades:"成績なし",noPay:"支払いなし",totalPaid:"支払総額",grade:"成績",admin:"管理",child:"子供",logout:"ログアウト",childBal:"子供の残高",review:"確認",allChecked:"確認済み！",confirmed:"確認 ✅",rejected:"却下",makePay:"支払い",amount:"金額",date:"日付",note:"メモ",notePh:"何のため...",payBtn:"支払う",payOk:"記録！💰",payHistory:"支払い履歴",noPayYet:"なし",delPay:"削除？",deleted:"削除済み",allGrades:"全成績",noGradesYet:"なし",subjects:"教科",subjMgmt:"教科管理",newSubjPh:"新しい教科...",added:"追加",cantDel:"削除不可。",delSubj:"削除？",settings:"設定",main:"基本",childName:"名前",pinChild:"子供PIN",pinParent:"親PIN",theme:"テーマ",girl:"女の子",boy:"男の子",lang:"言語",save:"保存",saved:"保存 ✅",selGrade:"成績選択！",selSubj:"教科選択！",enterAmt:"金額入力",pending:"確認待ち",approved:"承認",rejStatus:"却下",resetSubj:"教科リセット",forGrade:g=>`${g}の価格`,
      gl:["秀","優","良","可"],motGreat:(n,a)=>`🎉 すごい、${n}！平均：${a}`,motGood:(n,a)=>`💪 いいね、${n}！平均：${a}`,motOk:(n,a)=>`📚 ${n}、がんばろう！平均：${a}`}},
  de: { name:"Deutsch",flag:"🇩🇪",dir:"ltr",currency:"€",grades:[{value:5,label:"1(Sehr gut)",dp:10},{value:4,label:"2(Gut)",dp:5},{value:3,label:"3(Befriedigend)",dp:-2},{value:2,label:"4(Ausreichend)",dp:-5},{value:1,label:"5-6(Mangelhaft)",dp:-10}],defaultSubjects:["Mathematik","Deutsch","Englisch","Physik","Chemie","Biologie","Geschichte","Geografie","Sport","Musik","Kunst","Informatik"],defaultChild:"Sophie",
    ui:{appTitle:"Schulbelohnungen",enterPin:"PIN eingeben",wrongPin:"Falsche PIN",yourBalance:"Dein Guthaben",earned:"Verdient",paid:"Ausgezahlt",addGrade:"Note hinzufügen",whatGrade:"Welche Note?",subject:"Fach",selectSubject:"Fach wählen...",screenshot:"Screenshot",uploadPhoto:"Foto hochladen",comment:"Kommentar",commentPh:"Klausur, Hausaufgabe...",sendReview:"Senden",sent:"Gesendet! ✨",history:"Verlauf",payments:"Auszahlungen",prices:"Preise",gradePrices:"Notenpreise",noGrades:"Keine Noten",noPay:"Keine Auszahlungen",totalPaid:"Gesamt",grade:"Note",admin:"Admin",child:"Kind",logout:"Abmelden",childBal:"Guthaben Kind",review:"Prüfen",allChecked:"Alles geprüft!",confirmed:"Bestätigt ✅",rejected:"Abgelehnt",makePay:"Auszahlung",amount:"Betrag",date:"Datum",note:"Notiz",notePh:"Wofür...",payBtn:"Auszahlen",payOk:"Erfasst! 💰",payHistory:"Verlauf",noPayYet:"Keine",delPay:"Löschen?",deleted:"Gelöscht",allGrades:"Alle Noten",noGradesYet:"Keine",subjects:"Fächer",subjMgmt:"Fächerverwaltung",newSubjPh:"Neues Fach...",added:"Hinzugefügt",cantDel:"Nicht möglich.",delSubj:"Löschen?",settings:"Einstellungen",main:"Allgemein",childName:"Name",pinChild:"Kind PIN",pinParent:"Eltern PIN",theme:"Design",girl:"Mädchen",boy:"Junge",lang:"Sprache",save:"Speichern",saved:"Gespeichert ✅",selGrade:"Note wählen!",selSubj:"Fach wählen!",enterAmt:"Betrag?",pending:"Ausstehend",approved:"Genehmigt",rejStatus:"Abgelehnt",resetSubj:"Fächer zurücksetzen",forGrade:g=>`Für ${g}`,
      gl:["Einsen","Zweien","Dreien","Vieren"],motGreat:(n,a)=>`🎉 Super, ${n}! Schnitt: ${a}`,motGood:(n,a)=>`💪 Gut, ${n}! Schnitt: ${a}`,motOk:(n,a)=>`📚 Du schaffst das, ${n}! Schnitt: ${a}`}},
  vi: { name:"Tiếng Việt",flag:"🇻🇳",dir:"ltr",currency:"₫",grades:[{value:5,label:"Giỏi(9-10)",dp:50000},{value:4,label:"Khá(7-8)",dp:20000},{value:3,label:"TB(5-6)",dp:-10000},{value:2,label:"Yếu(3-4)",dp:-30000},{value:1,label:"Kém(0-2)",dp:-50000}],defaultSubjects:["Toán","Tiếng Việt","Tiếng Anh","Vật lý","Hóa học","Sinh học","Lịch sử","Địa lý","Thể dục","Âm nhạc","Mỹ thuật","Tin học"],defaultChild:"Linh",
    ui:{appTitle:"Phần Thưởng Học Tập",enterPin:"Nhập PIN",wrongPin:"Sai PIN",yourBalance:"Số dư",earned:"Đã kiếm",paid:"Đã trả",addGrade:"Thêm điểm",whatGrade:"Được điểm gì?",subject:"Môn",selectSubject:"Chọn môn...",screenshot:"Ảnh",uploadPhoto:"Tải ảnh",comment:"Ghi chú",commentPh:"Kiểm tra, bài tập...",sendReview:"Gửi",sent:"Đã gửi! ✨",history:"Lịch sử",payments:"Thanh toán",prices:"Bảng giá",gradePrices:"Giá điểm",noGrades:"Chưa có",noPay:"Chưa có",totalPaid:"Tổng trả",grade:"Điểm",admin:"Quản lý",child:"Con",logout:"Thoát",childBal:"Số dư con",review:"Xét duyệt",allChecked:"Xong!",confirmed:"Đã duyệt ✅",rejected:"Từ chối",makePay:"Thanh toán",amount:"Số tiền",date:"Ngày",note:"Ghi chú",notePh:"Cho gì...",payBtn:"Trả",payOk:"Ghi nhận! 💰",payHistory:"Lịch sử",noPayYet:"Chưa có",delPay:"Xóa?",deleted:"Đã xóa",allGrades:"Tất cả",noGradesYet:"Chưa có",subjects:"Môn học",subjMgmt:"Quản lý môn",newSubjPh:"Môn mới...",added:"Đã thêm",cantDel:"Không thể xóa.",delSubj:"Xóa?",settings:"Cài đặt",main:"Chung",childName:"Tên con",pinChild:"PIN con",pinParent:"PIN phụ huynh",theme:"Giao diện",girl:"Gái",boy:"Trai",lang:"Ngôn ngữ",save:"Lưu",saved:"Đã lưu ✅",selGrade:"Chọn điểm!",selSubj:"Chọn môn!",enterAmt:"Nhập tiền",pending:"Chờ",approved:"Đã duyệt",rejStatus:"Từ chối",resetSubj:"Reset môn",forGrade:g=>`Cho ${g}`,
      gl:["Giỏi","Khá","TB","Yếu"],motGreat:(n,a)=>`🎉 Tuyệt, ${n}! TB: ${a}`,motGood:(n,a)=>`💪 Giỏi, ${n}! TB: ${a}`,motOk:(n,a)=>`📚 Cố lên, ${n}! TB: ${a}`}},
  tr: { name:"Türkçe",flag:"🇹🇷",dir:"ltr",currency:"₺",grades:[{value:5,label:"5(Pekiyi)",dp:100},{value:4,label:"4(İyi)",dp:50},{value:3,label:"3(Orta)",dp:-25},{value:2,label:"2(Geçer)",dp:-50},{value:1,label:"1(Başarısız)",dp:-100}],defaultSubjects:["Matematik","Türkçe","İngilizce","Fen Bilimleri","Sosyal Bilgiler","Beden Eğitimi","Müzik","Görsel Sanatlar","Bilişim","Tarih","Coğrafya"],defaultChild:"Elif",
    ui:{appTitle:"Okul Ödülleri",enterPin:"PIN girin",wrongPin:"Yanlış PIN",yourBalance:"Bakiyen",earned:"Kazanılan",paid:"Ödenen",addGrade:"Not Ekle",whatGrade:"Hangi not?",subject:"Ders",selectSubject:"Ders seç...",screenshot:"Ekran görüntüsü",uploadPhoto:"Fotoğraf yükle",comment:"Yorum",commentPh:"Sınav, ödev...",sendReview:"Gönder",sent:"Gönderildi! ✨",history:"Geçmiş",payments:"Ödemeler",prices:"Fiyatlar",gradePrices:"Not Fiyatları",noGrades:"Not yok",noPay:"Ödeme yok",totalPaid:"Toplam",grade:"Not",admin:"Yönetim",child:"Çocuk",logout:"Çıkış",childBal:"Çocuk Bakiye",review:"İncele",allChecked:"Hepsi incelendi!",confirmed:"Onay ✅",rejected:"Reddedildi",makePay:"Ödeme Yap",amount:"Tutar",date:"Tarih",note:"Not",notePh:"Ne için...",payBtn:"Öde",payOk:"Kaydedildi! 💰",payHistory:"Ödeme Geçmişi",noPayYet:"Yok",delPay:"Sil?",deleted:"Silindi",allGrades:"Tüm Notlar",noGradesYet:"Yok",subjects:"Dersler",subjMgmt:"Ders Yönetimi",newSubjPh:"Yeni ders...",added:"Eklendi",cantDel:"Silinemez.",delSubj:"Sil?",settings:"Ayarlar",main:"Genel",childName:"Ad",pinChild:"Çocuk PIN",pinParent:"Ebeveyn PIN",theme:"Tema",girl:"Kız",boy:"Erkek",lang:"Dil",save:"Kaydet",saved:"Kaydedildi ✅",selGrade:"Not seç!",selSubj:"Ders seç!",enterAmt:"Tutar?",pending:"Beklemede",approved:"Onaylı",rejStatus:"Reddedildi",resetSubj:"Dersleri sıfırla",forGrade:g=>`${g} için`,
      gl:["Pekiyi","İyi","Orta","Geçer"],motGreat:(n,a)=>`🎉 Harika, ${n}! Ort: ${a}`,motGood:(n,a)=>`💪 İyi, ${n}! Ort: ${a}`,motOk:(n,a)=>`📚 Yapabilirsin, ${n}! Ort: ${a}`}},
  ko: { name:"한국어",flag:"🇰🇷",dir:"ltr",currency:"₩",grades:[{value:5,label:"수(A)",dp:10000},{value:4,label:"우(B)",dp:5000},{value:3,label:"미(C)",dp:-2000},{value:2,label:"양(D)",dp:-5000},{value:1,label:"가(F)",dp:-10000}],defaultSubjects:["수학","국어","영어","과학","사회","체육","음악","미술","정보","도덕"],defaultChild:"지민",
    ui:{appTitle:"학교 보상",enterPin:"PIN 입력",wrongPin:"잘못된 PIN",yourBalance:"잔액",earned:"획득",paid:"지급",addGrade:"성적 추가",whatGrade:"무슨 성적?",subject:"과목",selectSubject:"과목 선택...",screenshot:"스크린샷",uploadPhoto:"사진 업로드",comment:"메모",commentPh:"시험, 숙제...",sendReview:"검토 요청",sent:"전송! ✨",history:"기록",payments:"지급",prices:"요금",gradePrices:"성적 가격",noGrades:"없음",noPay:"없음",totalPaid:"총 지급",grade:"성적",admin:"관리",child:"아이",logout:"로그아웃",childBal:"아이 잔액",review:"검토",allChecked:"완료!",confirmed:"확인 ✅",rejected:"거부",makePay:"지급하기",amount:"금액",date:"날짜",note:"메모",notePh:"무엇을 위해...",payBtn:"지급",payOk:"기록! 💰",payHistory:"지급 기록",noPayYet:"없음",delPay:"삭제?",deleted:"삭제됨",allGrades:"전체",noGradesYet:"없음",subjects:"과목",subjMgmt:"과목 관리",newSubjPh:"새 과목...",added:"추가됨",cantDel:"삭제 불가.",delSubj:"삭제?",settings:"설정",main:"일반",childName:"이름",pinChild:"아이 PIN",pinParent:"부모 PIN",theme:"테마",girl:"여아",boy:"남아",lang:"언어",save:"저장",saved:"저장 ✅",selGrade:"성적!",selSubj:"과목!",enterAmt:"금액?",pending:"대기",approved:"승인",rejStatus:"거부",resetSubj:"과목 리셋",forGrade:g=>`${g}에 대해`,
      gl:["수","우","미","양"],motGreat:(n,a)=>`🎉 훌륭해, ${n}! 평균: ${a}`,motGood:(n,a)=>`💪 잘했어, ${n}! 평균: ${a}`,motOk:(n,a)=>`📚 힘내, ${n}! 평균: ${a}`}},
};

const KEYS={settings:"sr:settings",subjects:"sr:subjects",grades:"sr:grades",payments:"sr:payments",screenshots:"sr:screenshots"};
async function ld(k,fb){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):fb}catch{return fb}}
async function sv(k,d){try{await window.storage.set(k,JSON.stringify(d))}catch(e){console.error(e)}}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const fDate=(d,l="ru")=>{try{return new Date(d).toLocaleDateString(l,{day:"numeric",month:"long",year:"numeric"})}catch{return d}};
const fDT=(d,l="ru")=>{try{return new Date(d).toLocaleDateString(l,{day:"numeric",month:"short"})+" "+new Date(d).toLocaleTimeString(l,{hour:"2-digit",minute:"2-digit"})}catch{return d}};

const TH={girl:{p:"#e91e8c",pl:"#fce4f3",s:"#ab47bc",bg:"linear-gradient(135deg,#fce4ec 0%,#f3e5f5 50%,#ede7f6 100%)",cb:"rgba(233,30,140,.15)",tm:"#4a1942",tmu:"#8e6a8e",sh:"0 8px 32px rgba(233,30,140,.1)"},boy:{p:"#1976d2",pl:"#e3f2fd",s:"#26a69a",bg:"linear-gradient(135deg,#e3f2fd 0%,#e0f2f1 50%,#e8eaf6 100%)",cb:"rgba(25,118,210,.15)",tm:"#1a237e",tmu:"#5c6bc0",sh:"0 8px 32px rgba(25,118,210,.1)"}};
const GC={5:"#66bb6a",4:"#42a5f5",3:"#ffa726",2:"#ef5350",1:"#b71c1c"};
const GB={5:"#e8f5e9",4:"#e3f2fd",3:"#fff3e0",2:"#ffebee",1:"#ffcdd2"};

export default function App(){
  const[loading,setLoading]=useState(true);const[role,setRole]=useState(null);const[vChild,setVChild]=useState(false);
  const[S,setS]=useState(null);const[subj,setSubj]=useState([]);const[gr,setGr]=useState([]);const[pay,setPay]=useState([]);const[scr,setScr]=useState({});const[toast,setToast]=useState(null);

  useEffect(()=>{(async()=>{
    let s=await ld(KEYS.settings,null);
    if(!s){const l=LOCALES.ru;s={pin_child:"1234",pin_parent:"0000",child_name:l.defaultChild,theme:"girl",lang:"ru",currency:l.currency};l.grades.forEach(g=>{s["price_"+g.value]=g.dp});await sv(KEYS.settings,s)}
    if(!s.lang){s.lang="ru";await sv(KEYS.settings,s)}
    setS(s);let sb=await ld(KEYS.subjects,null);
    if(!sb){const l=LOCALES[s.lang]||LOCALES.ru;sb=l.defaultSubjects.map((n,i)=>({id:uid()+i,name:n,active:true}));await sv(KEYS.subjects,sb)}
    setSubj(sb);setGr(await ld(KEYS.grades,[]));setPay(await ld(KEYS.payments,[]));setScr(await ld(KEYS.screenshots,{}));setLoading(false);
  })()},[]);

  const uS=async s=>{setS(s);await sv(KEYS.settings,s)};const uSb=async s=>{setSubj(s);await sv(KEYS.subjects,s)};
  const uG=async g=>{setGr(g);await sv(KEYS.grades,g)};const uP=async p=>{setPay(p);await sv(KEYS.payments,p)};
  const uScr=async s=>{setScr(s);await sv(KEYS.screenshots,s)};
  const sT=(m,ty="info")=>{setToast({m,ty});setTimeout(()=>setToast(null),2500)};

  if(loading||!S)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#fce4ec,#f3e5f5,#ede7f6)"}}><div style={{fontSize:"3rem"}}>🌟</div></div>;

  const lang=S.lang||"ru",loc=LOCALES[lang]||LOCALES.ru,ui=loc.ui,t=TH[S.theme]||TH.girl,cur=S.currency||loc.currency,dir=loc.dir;
  const aG=gr.filter(g=>g.status==="approved"),pG=gr.filter(g=>g.status==="pending");
  const tE=aG.reduce((s,g)=>s+g.amount,0),tP=pay.reduce((s,p)=>s+p.amount,0),bal=tE-tP;
  const gc={};loc.grades.forEach(g=>{gc[g.value]=0});aG.forEach(g=>{gc[g.grade]=(gc[g.grade]||0)+1});
  const avg=aG.length?(aG.reduce((s,g)=>s+g.grade,0)/aG.length).toFixed(1):0;

  const css=`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Comfortaa:wght@400;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${t.pl};border-radius:3px}@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`;
  const show=role==="child"||vChild;

  return(<div dir={dir} style={{minHeight:"100vh",background:t.bg,fontFamily:"'Nunito','Segoe UI',sans-serif",color:t.tm}}>
    <style>{css}</style>
    {toast&&<div style={{position:"fixed",top:20,[dir==="rtl"?"left":"right"]:20,zIndex:9999,padding:"14px 24px",borderRadius:14,background:toast.ty==="success"?"#66bb6a":toast.ty==="error"?"#ef5350":t.tm,color:"#fff",fontWeight:700,boxShadow:"0 8px 32px rgba(0,0,0,.2)",maxWidth:320}}>{toast.m}</div>}
    {!role&&<Login S={S} t={t} ui={ui} onLogin={setRole}/>}
    {role&&show&&<Child S={S} t={t} loc={loc} ui={ui} cur={cur} lang={lang} subj={subj.filter(s=>s.active)} gr={gr} pay={pay} scr={scr} bal={bal} tE={tE} tP={tP} gc={gc} avg={avg} pC={pG.length}
      onAdd={async(g,sd)=>{await uG([...gr,g]);if(sd)await uScr({...scr,[g.id]:sd});sT(ui.sent,"success")}}
      onOut={()=>{setRole(null);setVChild(false)}} isPV={vChild} onBack={()=>setVChild(false)}/>}
    {role==="parent"&&!vChild&&<Parent S={S} t={t} loc={loc} ui={ui} cur={cur} lang={lang} subj={subj} gr={gr} pay={pay} scr={scr} bal={bal} tE={tE} tP={tP} pG={pG} gc={gc}
      onRev={async(id,st)=>{await uG(gr.map(g=>g.id===id?{...g,status:st,amount:st==="approved"?(S["price_"+g.grade]||0):0}:g));sT(st==="approved"?ui.confirmed:ui.rejected,"success")}}
      onAddP={async p=>{await uP([...pay,p]);sT(ui.payOk,"success")}}
      onDelP={async id=>{await uP(pay.filter(p=>p.id!==id));sT(ui.deleted,"success")}}
      onUS={async s=>{await uS(s);sT(ui.saved,"success")}} onUSb={uSb}
      onVC={()=>setVChild(true)} onOut={()=>setRole(null)} sT={sT}
      onCL={async nl=>{const nl2=LOCALES[nl];const ns={...S,lang:nl,currency:nl2.currency};nl2.grades.forEach(g=>{if(ns["price_"+g.value]===undefined)ns["price_"+g.value]=g.dp});await uS(ns)}}
      onRS={async nl=>{const nl2=LOCALES[nl];await uSb(nl2.defaultSubjects.map((n,i)=>({id:uid()+i,name:n,active:true})))}}
    />}
  </div>);
}

// ===== LOGIN =====
function Login({S,t,ui,onLogin}){
  const[pin,setPin]=useState("");const[err,setErr]=useState("");const[shake,setSh]=useState(false);
  const enter=d=>{if(pin.length>=4)return;const np=pin+d;setPin(np);setErr("");if(np.length===4)setTimeout(()=>{if(np===S.pin_parent)onLogin("parent");else if(np===S.pin_child)onLogin("child");else{setErr(ui.wrongPin);setPin("");setSh(true);setTimeout(()=>setSh(false),400)}},200)};
  const bs={width:62,height:62,borderRadius:"50%",border:`2px solid ${t.cb}`,background:"rgba(255,255,255,.85)",fontSize:20,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:t.tm,fontFamily:"'Comfortaa',sans-serif"};
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24}}>
    <div style={{background:"rgba(255,255,255,.85)",backdropFilter:"blur(16px)",borderRadius:28,padding:"40px 28px",boxShadow:t.sh,textAlign:"center",maxWidth:340,width:"100%",animation:shake?"shake .4s":"none"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:t.bg,border:`4px solid ${t.pl}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:38}}>🌟</div>
      <h2 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1.15rem",marginBottom:4}}>{ui.appTitle}</h2>
      <p style={{color:t.tmu,fontSize:".85rem",marginBottom:2}}>{S.child_name}</p>
      <p style={{color:t.tmu,fontSize:".78rem",marginBottom:12}}>{ui.enterPin}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",margin:"14px 0"}}>
        {[0,1,2,3].map(i=><div key={i} style={{width:15,height:15,borderRadius:"50%",border:`2px solid ${t.p}`,background:i<pin.length?t.p:"transparent",transition:"all .2s",transform:i<pin.length?"scale(1.2)":"scale(1)"}}/>)}
      </div>
      <div style={{color:"#ef5350",fontWeight:600,fontSize:".8rem",minHeight:20,marginBottom:6}}>{err}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxWidth:220,margin:"0 auto"}}>
        {[1,2,3,4,5,6,7,8,9].map(d=><button key={d} style={bs} onClick={()=>enter(String(d))}>{d}</button>)}
        <button style={{...bs,fontSize:14}} onClick={()=>{setPin("");setErr("")}}>↺</button>
        <button style={bs} onClick={()=>enter("0")}>0</button>
        <button style={{...bs,fontSize:14}} onClick={()=>{setPin(p=>p.slice(0,-1));setErr("")}}>⌫</button>
      </div>
    </div>
  </div>);
}

// ===== SHARED =====
const cd=t=>({background:"rgba(255,255,255,.85)",backdropFilter:"blur(12px)",border:`1px solid ${t.cb}`,borderRadius:20,boxShadow:t.sh,padding:24,marginBottom:20});
const inp=t=>({width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${t.cb}`,fontFamily:"'Nunito',sans-serif",fontSize:".95rem",marginBottom:12,background:"#fff"});
const lb=t=>({fontWeight:700,fontSize:".85rem",color:t.tmu,display:"block",marginBottom:6});
const pb=t=>({padding:"14px 28px",background:`linear-gradient(135deg,${t.p},${t.s})`,color:"#fff",border:"none",borderRadius:14,fontWeight:700,fontSize:"1rem",cursor:"pointer",fontFamily:"'Nunito',sans-serif",width:"100%"});
const tb=(t,a)=>({flex:1,padding:"10px 8px",border:"none",background:a?"white":"transparent",borderRadius:11,fontWeight:700,fontSize:".76rem",color:a?t.p:t.tmu,cursor:"pointer",boxShadow:a?"0 2px 8px rgba(0,0,0,.08)":"none",whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif"});
const ob=t=>({padding:"6px 14px",border:`2px solid ${t.p}`,background:"transparent",color:t.p,borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:".82rem"});

function GI({g,t,cur,ui,scr,onImg,showSt,lang,children}){
  const sc={pending:[t.pl,"#e65100"],approved:["#e8f5e9","#2e7d32"],rejected:["#ffebee","#c62828"]};const c=sc[g.status]||sc.pending;
  const sl={pending:ui.pending,approved:ui.approved,rejected:ui.rejStatus};
  return(<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"rgba(255,255,255,.85)",borderRadius:14,border:`1px solid ${t.cb}`,marginBottom:8,flexWrap:"wrap",animation:"fadeIn .3s"}}>
    <div style={{width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0,background:GB[g.grade]||"#eee",color:GC[g.grade]||"#333",fontFamily:"'Comfortaa',sans-serif"}}>{g.gradeLabel||g.grade}</div>
    <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:".9rem"}}>{g.subjectName}</div><div style={{fontSize:".73rem",color:t.tmu}}>{fDT(g.createdAt,lang)}{g.comment?` — ${g.comment}`:""}</div></div>
    {showSt&&<span style={{fontSize:".68rem",padding:"3px 10px",borderRadius:20,fontWeight:700,background:c[0],color:c[1],whiteSpace:"nowrap"}}>{sl[g.status]}</span>}
    {g.status==="approved"&&<div style={{fontWeight:800,fontFamily:"'Comfortaa',sans-serif",whiteSpace:"nowrap",color:g.amount>=0?"#66bb6a":"#ef5350"}}>{g.amount>=0?"+":""}{Math.round(g.amount)} {cur}</div>}
    {scr[g.id]&&<button onClick={()=>onImg(scr[g.id])} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1rem",color:t.tmu}}>🖼️</button>}
    {children}
  </div>);
}

// ===== CHILD =====
function Child({S,t,loc,ui,cur,lang,subj,gr,pay,scr,bal,tE,tP,gc,avg,pC,onAdd,onOut,isPV,onBack}){
  const[tab,setTab]=useState("add");const[sG,setSG]=useState(null);const[sS,setSS]=useState("");const[cm,setCm]=useState("");const[sd,setSd]=useState(null);const[sp,setSp]=useState(null);const[mo,setMo]=useState(null);const fr=useRef();
  const hf=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setSd(ev.target.result);setSp(ev.target.result)};r.readAsDataURL(f)};
  const sub=()=>{if(!sG||!sS)return;const s=subj.find(x=>x.id===sS);const gd=loc.grades.find(x=>x.value===sG);
    onAdd({id:uid(),grade:sG,gradeLabel:gd?.label||sG,subjectId:sS,subjectName:s?.name||"?",comment:cm,status:"pending",amount:S["price_"+sG]||0,createdAt:new Date().toISOString()},sd);
    setSG(null);setSS("");setCm("");setSd(null);setSp(null);if(fr.current)fr.current.value=""};
  const mt=avg>=4.5?{bg:"#e8f5e9",c:"#2e7d32",m:ui.motGreat(S.child_name,avg)}:avg>=3.5?{bg:"#e3f2fd",c:"#1565c0",m:ui.motGood(S.child_name,avg)}:avg>0?{bg:"#fff3e0",c:"#e65100",m:ui.motOk(S.child_name,avg)}:null;
  const dg=loc.grades.slice(0,4);

  return(<div style={{maxWidth:900,margin:"0 auto",padding:16,position:"relative",zIndex:1}}>
    {mo&&<div onClick={()=>setMo(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:24,maxWidth:500,width:"100%",maxHeight:"80vh",overflow:"auto"}}><img src={mo} style={{maxWidth:"100%",borderRadius:12}}/><button onClick={()=>setMo(null)} style={{...ob(t),width:"100%",marginTop:12}}>✕</button></div></div>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0"}}>
      <h1 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1.3rem",fontWeight:800}}>🌟 {S.child_name}</h1>
      <div style={{display:"flex",gap:8}}>{isPV&&<button onClick={onBack} style={ob(t)}>⚙️</button>}<button onClick={onOut} style={ob(t)}>{ui.logout}</button></div>
    </div>
    <div style={{background:`linear-gradient(135deg,${t.p},${t.s})`,color:"#fff",borderRadius:20,padding:24,textAlign:"center",boxShadow:`0 12px 40px ${t.p}33`,marginBottom:24,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:"rgba(255,255,255,.1)",borderRadius:"50%"}}/>
      <div style={{opacity:.85,fontSize:".85rem",textTransform:"uppercase",letterSpacing:2}}>{ui.yourBalance}</div>
      <div style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"2.4rem",fontWeight:900,lineHeight:1,margin:"8px 0"}}>{Math.round(bal)} {cur}</div>
      <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:14,fontSize:".82rem",opacity:.9,flexWrap:"wrap"}}>
        <span>📈 {ui.earned}: <b>{Math.round(tE)} {cur}</b></span><span>💳 {ui.paid}: <b>{Math.round(tP)} {cur}</b></span>
      </div>
    </div>
    {mt&&<div style={{textAlign:"center",padding:12,borderRadius:14,fontWeight:700,marginBottom:14,background:mt.bg,color:mt.c,fontSize:".9rem"}}>{mt.m}</div>}
    <div style={{display:"grid",gridTemplateColumns:`repeat(${dg.length},1fr)`,gap:10,marginBottom:18}}>
      {dg.map((g,i)=><div key={g.value} style={{background:"rgba(255,255,255,.85)",borderRadius:14,padding:12,textAlign:"center",border:`1px solid ${t.cb}`}}><div style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1.5rem",fontWeight:800,color:GC[g.value]}}>{gc[g.value]||0}</div><div style={{fontSize:".7rem",color:t.tmu,marginTop:2}}>{ui.gl?.[i]||g.label}</div></div>)}
    </div>
    <div style={{display:"flex",gap:4,background:t.pl,borderRadius:14,padding:4,marginBottom:18,overflowX:"auto"}}>
      {[["add",`➕ ${ui.grade}`],["history",`📋 ${ui.history}`],["payments",`💳 ${ui.payments}`],["prices",`💰 ${ui.prices}`]].map(([k,l])=><button key={k} style={tb(t,tab===k)} onClick={()=>setTab(k)}>{l}</button>)}
    </div>
    {tab==="add"&&<div style={cd(t)}>
      <h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>⭐ {ui.addGrade}</h3>
      <p style={lb(t)}>{ui.whatGrade}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
        {loc.grades.map(g=>{const p=S["price_"+g.value]??g.dp;const sel=sG===g.value;return<button key={g.value} onClick={()=>setSG(g.value)} style={{minWidth:64,minHeight:64,borderRadius:14,border:sel?`3px solid ${t.p}`:"3px solid transparent",fontSize:g.label.length>4?12:20,fontWeight:800,fontFamily:"'Comfortaa',sans-serif",cursor:"pointer",background:GB[g.value],color:GC[g.value],display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6px 8px",transform:sel?"scale(1.1)":"scale(1)",boxShadow:sel?"0 6px 20px rgba(0,0,0,.15)":"none",transition:"all .2s",lineHeight:1.1}}>
          <span style={{fontSize:g.label.length>6?10:undefined}}>{g.label}</span><span style={{fontSize:9,fontWeight:600,marginTop:2}}>{p>=0?"+":""}{p}{cur}</span>
        </button>})}
      </div>
      <label style={lb(t)}>{ui.subject}</label>
      <select value={sS} onChange={e=>setSS(e.target.value)} style={{...inp(t),appearance:"auto"}}><option value="">{ui.selectSubject}</option>{subj.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <label style={lb(t)}>{ui.screenshot}</label>
      <div onClick={()=>fr.current?.click()} style={{border:`2px dashed ${sp?"#66bb6a":t.cb}`,borderRadius:14,padding:18,textAlign:"center",cursor:"pointer",marginBottom:12,background:sp?"#e8f5e9":"transparent"}}>
        <input ref={fr} type="file" accept="image/*" onChange={hf} style={{display:"none"}}/>
        {sp?<img src={sp} style={{maxWidth:90,maxHeight:70,borderRadius:8}}/>:<><div style={{fontSize:22,color:t.tmu}}>📷</div><div style={{fontSize:".78rem",color:t.tmu,marginTop:4}}>{ui.uploadPhoto}</div></>}
      </div>
      <label style={lb(t)}>{ui.comment}</label>
      <input value={cm} onChange={e=>setCm(e.target.value)} placeholder={ui.commentPh} style={inp(t)}/>
      <button onClick={sub} disabled={!sG||!sS} style={{...pb(t),opacity:sG&&sS?1:.5,cursor:sG&&sS?"pointer":"not-allowed"}}>📤 {ui.sendReview}</button>
    </div>}
    {tab==="history"&&<div>{gr.length===0?<div style={{textAlign:"center",padding:40,color:t.tmu}}>📭<br/>{ui.noGrades}</div>:[...gr].reverse().map(g=><GI key={g.id} g={g} t={t} cur={cur} ui={ui} scr={scr} onImg={setMo} showSt lang={lang}/>)}</div>}
    {tab==="payments"&&<div>{pay.length===0?<div style={{textAlign:"center",padding:40,color:t.tmu}}>💳<br/>{ui.noPay}</div>:<><div style={{...cd(t),textAlign:"center"}}><div style={{fontSize:".82rem",color:t.tmu}}>{ui.totalPaid}</div><div style={{fontSize:"1.7rem",fontWeight:800,fontFamily:"'Comfortaa',sans-serif",color:t.p}}>{Math.round(tP)} {cur}</div></div>{[...pay].reverse().map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,.85)",borderRadius:14,border:`1px solid ${t.cb}`,marginBottom:8}}><div style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${t.pl},#fff)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💰</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:".88rem"}}>{Math.round(p.amount)} {cur}</div><div style={{fontSize:".7rem",color:t.tmu}}>{fDate(p.date,lang)}{p.note?` — ${p.note}`:""}</div></div></div>)}</>}</div>}
    {tab==="prices"&&<div style={cd(t)}>
      <h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>💰 {ui.gradePrices}</h3>
      {loc.grades.map(g=>{const p=S["price_"+g.value]??g.dp;return<div key={g.value} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:10,background:GB[g.value],borderRadius:12,marginBottom:6}}><span style={{fontWeight:800,fontSize:".9rem"}}>{g.label}</span><span style={{padding:"4px 12px",borderRadius:20,fontWeight:700,fontSize:".82rem",background:p>=0?"#e8f5e9":"#ffebee",color:p>=0?"#66bb6a":"#ef5350"}}>{p>=0?"+":""}{p} {cur}</span></div>})}
    </div>}
  </div>);
}

// ===== PARENT =====
function Parent({S,t,loc,ui,cur,lang,subj,gr,pay,scr,bal,tE,tP,pG,gc,onRev,onAddP,onDelP,onUS,onUSb,onVC,onOut,sT,onCL,onRS}){
  const[tab,setTab]=useState("review");const[pA,setPA]=useState("");const[pD,setPD]=useState(new Date().toISOString().split("T")[0]);const[pN,setPN]=useState("");const[nS,setNS]=useState("");const[ls,setLs]=useState(S);const[mo,setMo]=useState(null);
  useEffect(()=>{setLs(S)},[S]);

  return(<div style={{maxWidth:900,margin:"0 auto",padding:16,position:"relative",zIndex:1}}>
    {mo&&<div onClick={()=>setMo(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:24,maxWidth:500,width:"100%"}}><img src={mo} style={{maxWidth:"100%",borderRadius:12}}/><button onClick={()=>setMo(null)} style={{...ob(t),width:"100%",marginTop:12}}>✕</button></div></div>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0"}}>
      <h1 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1.3rem",fontWeight:800}}>⚙️ {ui.admin}</h1>
      <div style={{display:"flex",gap:8}}><button onClick={onVC} style={ob(t)}>👁 {ui.child}</button><button onClick={onOut} style={ob(t)}>{ui.logout}</button></div>
    </div>
    <div style={{background:`linear-gradient(135deg,${t.p},${t.s})`,color:"#fff",borderRadius:20,padding:22,textAlign:"center",marginBottom:24,position:"relative",overflow:"hidden"}}>
      <div style={{opacity:.85,fontSize:".82rem",textTransform:"uppercase",letterSpacing:2}}>{ui.childBal}</div>
      <div style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"2.4rem",fontWeight:900,lineHeight:1,margin:"6px 0"}}>{Math.round(bal)} {cur}</div>
      <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:10,fontSize:".82rem",opacity:.9,flexWrap:"wrap"}}><span>{ui.earned}: <b>{Math.round(tE)} {cur}</b></span><span>{ui.paid}: <b>{Math.round(tP)} {cur}</b></span></div>
    </div>
    <div style={{display:"flex",gap:4,background:t.pl,borderRadius:14,padding:4,marginBottom:18,overflowX:"auto"}}>
      {[["review",`✅ ${ui.review}${pG.length?` (${pG.length})`:""}`],["payments",`💳 ${ui.payments}`],["grades",`📋 ${ui.allGrades}`],["subjects",`📚 ${ui.subjects}`],["settings",`⚙️ ${ui.settings}`]].map(([k,l])=><button key={k} style={tb(t,tab===k)} onClick={()=>setTab(k)}>{l}</button>)}
    </div>

    {tab==="review"&&<div><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>⏳ {ui.review}</h3>
      {pG.length===0?<div style={{textAlign:"center",padding:40,color:t.tmu}}>✅<br/>{ui.allChecked}</div>:pG.map(g=><GI key={g.id} g={g} t={t} cur={cur} ui={ui} scr={scr} onImg={setMo} lang={lang}>
        <div style={{display:"flex",gap:6}}><button onClick={()=>onRev(g.id,"approved")} style={{background:"#66bb6a",color:"#fff",border:"none",borderRadius:10,padding:"6px 14px",fontWeight:700,cursor:"pointer",fontSize:".8rem"}}>✓</button><button onClick={()=>onRev(g.id,"rejected")} style={{background:"#ef5350",color:"#fff",border:"none",borderRadius:10,padding:"6px 14px",fontWeight:700,cursor:"pointer",fontSize:".8rem"}}>✕</button></div>
      </GI>)}
    </div>}

    {tab==="payments"&&<div>
      <div style={cd(t)}><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>💸 {ui.makePay}</h3>
        <label style={lb(t)}>{ui.amount}</label><input type="number" value={pA} onChange={e=>setPA(e.target.value)} style={inp(t)}/>
        <label style={lb(t)}>{ui.date}</label><input type="date" value={pD} onChange={e=>setPD(e.target.value)} style={inp(t)}/>
        <label style={lb(t)}>{ui.note}</label><input value={pN} onChange={e=>setPN(e.target.value)} placeholder={ui.notePh} style={inp(t)}/>
        <button onClick={()=>{if(!pA||parseFloat(pA)<=0)return sT(ui.enterAmt,"error");onAddP({id:uid(),amount:parseFloat(pA),date:pD,note:pN,createdAt:new Date().toISOString()});setPA("");setPN("")}} style={pb(t)}>💰 {ui.payBtn}</button>
      </div>
      <h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>📋 {ui.payHistory}</h3>
      {pay.length===0?<div style={{textAlign:"center",padding:40,color:t.tmu}}>💳<br/>{ui.noPayYet}</div>:[...pay].reverse().map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,.85)",borderRadius:14,border:`1px solid ${t.cb}`,marginBottom:8}}>
        <div style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${t.pl},#fff)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💰</div>
        <div style={{flex:1}}><div style={{fontWeight:700}}>{Math.round(p.amount)} {cur}</div><div style={{fontSize:".7rem",color:t.tmu}}>{fDate(p.date,lang)}{p.note?` — ${p.note}`:""}</div></div>
        <button onClick={()=>{if(confirm(ui.delPay))onDelP(p.id)}} style={{background:"#ef5350",color:"#fff",border:"none",borderRadius:10,padding:"6px 12px",fontWeight:700,cursor:"pointer",fontSize:".7rem"}}>🗑</button>
      </div>)}
    </div>}

    {tab==="grades"&&<div><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>📋 {ui.allGrades}</h3>
      {gr.length===0?<div style={{textAlign:"center",padding:40,color:t.tmu}}>📭<br/>{ui.noGradesYet}</div>:[...gr].reverse().map(g=><GI key={g.id} g={g} t={t} cur={cur} ui={ui} scr={scr} onImg={setMo} showSt lang={lang}/>)}</div>}

    {tab==="subjects"&&<div style={cd(t)}><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>📚 {ui.subjMgmt}</h3>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <input value={nS} onChange={e=>setNS(e.target.value)} placeholder={ui.newSubjPh} style={{...inp(t),flex:1,marginBottom:0}} onKeyDown={e=>{if(e.key==="Enter"&&nS.trim()){onUSb([...subj,{id:uid(),name:nS.trim(),active:true}]);setNS("");sT(ui.added,"success")}}}/>
        <button onClick={()=>{if(!nS.trim())return;onUSb([...subj,{id:uid(),name:nS.trim(),active:true}]);setNS("");sT(ui.added,"success")}} style={{padding:"10px 16px",background:`linear-gradient(135deg,${t.p},${t.s})`,color:"#fff",border:"none",borderRadius:12,fontWeight:700,cursor:"pointer"}}>➕</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {subj.map(s=><div key={s.id} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:".8rem",fontWeight:600,border:`1px solid ${t.cb}`,background:"#fff",opacity:s.active?1:.4,textDecoration:s.active?"none":"line-through"}}>
          {s.name}
          <button onClick={()=>onUSb(subj.map(x=>x.id===s.id?{...x,active:!x.active}:x))} style={{background:"none",border:"none",cursor:"pointer",fontSize:".8rem",padding:"0 2px",color:t.tmu}}>{s.active?"👁":"👁‍🗨"}</button>
          <button onClick={()=>{if(gr.some(g=>g.subjectId===s.id)){sT(ui.cantDel,"error");return}if(confirm(ui.delSubj))onUSb(subj.filter(x=>x.id!==s.id))}} style={{background:"none",border:"none",cursor:"pointer",fontSize:".8rem",padding:"0 2px",color:t.tmu}}>🗑</button>
        </div>)}
      </div>
    </div>}

    {tab==="settings"&&<div>
      <div style={cd(t)}><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>⚙️ {ui.main}</h3>
        <label style={lb(t)}>{ui.childName}</label><input value={ls.child_name} onChange={e=>setLs({...ls,child_name:e.target.value})} style={inp(t)}/>
        <label style={lb(t)}>{ui.pinChild}</label><input value={ls.pin_child} onChange={e=>setLs({...ls,pin_child:e.target.value})} maxLength={4} style={inp(t)}/>
        <label style={lb(t)}>{ui.pinParent}</label><input value={ls.pin_parent} onChange={e=>setLs({...ls,pin_parent:e.target.value})} maxLength={4} style={inp(t)}/>
        <h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,margin:"16px 0 10px"}}>🎨 {ui.theme}</h3>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <span style={{fontSize:"1.3rem"}}>👧</span><span style={{fontWeight:700}}>{ui.girl}</span>
          <div onClick={()=>setLs({...ls,theme:ls.theme==="girl"?"boy":"girl"})} style={{width:50,height:26,borderRadius:13,background:ls.theme==="boy"?t.p:t.pl,position:"relative",cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:3,transition:"transform .3s",transform:ls.theme==="boy"?"translateX(24px)":"translateX(0)",boxShadow:"0 2px 4px rgba(0,0,0,.15)"}}/>
          </div>
          <span style={{fontWeight:700}}>{ui.boy}</span><span style={{fontSize:"1.3rem"}}>👦</span>
        </div>
        <h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,margin:"16px 0 10px"}}>🌐 {ui.lang}</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
          {Object.entries(LOCALES).map(([c,l])=><button key={c} onClick={()=>{setLs({...ls,lang:c,currency:l.currency});onCL(c)}} style={{padding:"7px 12px",borderRadius:10,border:ls.lang===c?`2px solid ${t.p}`:`2px solid ${t.cb}`,background:ls.lang===c?t.pl:"#fff",fontWeight:700,cursor:"pointer",fontSize:".78rem",display:"flex",alignItems:"center",gap:3}}><span>{l.flag}</span> {l.name}</button>)}
        </div>
        <button onClick={()=>{if(confirm("Reset?"))onRS(ls.lang||"ru")}} style={{background:"none",border:"none",cursor:"pointer",color:t.p,fontWeight:700,fontSize:".78rem",textDecoration:"underline",marginBottom:8}}>🔄 {ui.resetSubj}</button>
      </div>
      <div style={cd(t)}><h3 style={{fontFamily:"'Comfortaa',sans-serif",fontSize:"1rem",fontWeight:800,marginBottom:12}}>💰 {ui.gradePrices}</h3>
        {(LOCALES[ls.lang||"ru"]||LOCALES.ru).grades.map(g=><div key={g.value}><label style={lb(t)}>{ui.forGrade(g.label)} ({ls.currency||cur})</label><input type="number" value={ls["price_"+g.value]??g.dp} onChange={e=>setLs({...ls,["price_"+g.value]:parseFloat(e.target.value)||0})} style={inp(t)}/></div>)}
        <button onClick={()=>onUS(ls)} style={pb(t)}>💾 {ui.save}</button>
      </div>
    </div>}
  </div>);
}
