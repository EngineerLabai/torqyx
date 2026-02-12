import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

type Bullet = { title: string; points: string[] };

type Section = {
  title: string;
  intro: string;
  items: Bullet[];
};

const sections: Section[] = [
  {
    title: "1. DiÅŸli Temelleri",
    intro: "DiÅŸli tanÄ±mlarÄ±, modÃ¼l/hatve ve referans daireleri iÃ§in hÄ±zlÄ± Ã¶zet.",
    items: [
      {
        title: "1.1 DiÅŸli TanÄ±mlarÄ± ve Geometri Temeli",
        points: [
          "ModÃ¼l nedir, neden kritik? ModÃ¼l (m) diÅŸ boyutunu belirler; aynÄ± modÃ¼lde Ã§alÄ±ÅŸan diÅŸliler aynÄ± hatve dairesi adÄ±mÄ±nÄ± paylaÅŸÄ±r.",
          "DiÅŸ sayÄ±sÄ± ve aktarÄ±m oranÄ± iliÅŸkisi: i = z2/z1; kÃ¼Ã§Ã¼k diÅŸ sayÄ±sÄ±nda undercut ve profil kaydÄ±rma ihtiyacÄ± doÄŸar.",
          "AdÄ±m (pitch), hatve, taksimat dairesi: hatve dairesi Ã§evresindeki diÅŸ aralÄ±ÄŸÄ± Ï€Â·m; hatve doÄŸrusu heliste helis aÃ§Ä±sÄ±na baÄŸlÄ±dÄ±r.",
          "Referans dairesi, taban dairesi, kafa ve dip daireleri: temas Ã§izgisi taban dairesinde baÅŸlar, kafa/dip boÅŸluklarÄ± temas gÃ¼venliÄŸi saÄŸlar.",
          "BasÄ±nÃ§ aÃ§Ä±sÄ± (20Â° / 17.5Â° / 14.5Â°): aÃ§Ä± kÃ¼Ã§Ã¼ldÃ¼kÃ§e sessizlik artar ama diÅŸ dibi zayÄ±flar; 20Â° gÃ¼ncel standart, yÃ¼ksek yÃ¼kte daha rijit.",
        ],
      },
    ],
  },
  {
    title: "2. DiÅŸli Tipleri",
    intro: "DÃ¼z, helis, konik, salyangoz, planet ve kremayer/zincir iÃ§in kÄ±sa teknik notlar.",
    items: [
      {
        title: "2.1 DÃ¼z DiÅŸliler",
        points: [
          "Kuvvetler: Ft (tangansiyel), Fr (radyal), Fa â‰ˆ 0; yataklama radyal aÄŸÄ±rlÄ±klÄ± seÃ§ilir.",
          "Avantaj: takÄ±m maliyeti dÃ¼ÅŸÃ¼k, taÅŸlama kolay; dezavantaj: ses/vibrasyon helise gÃ¶re yÃ¼ksek.",
          "KullanÄ±m: dÃ¼ÅŸÃ¼k/orta hÄ±z, maliyet duyarlÄ± uygulamalar.",
        ],
      },
      {
        title: "2.2 Helis DiÅŸliler â€“ Helis AÃ§Ä±sÄ±, Eksenel Kuvvet Analizi",
        points: [
          "Kuvvetler: Ft; Fr = FtÂ·tan(Î±t), Fa = FtÂ·tan(Î²). Î² arttÄ±kÃ§a Fa bÃ¼yÃ¼r, sessizlik artar.",
          "Ã‡ift helis/herringbone ile Fa dengelenir; yataklama eksenel kuvveti taÅŸÄ±yacak ÅŸekilde seÃ§ilir.",
          "KullanÄ±m: orta/yÃ¼ksek hÄ±z, dÃ¼ÅŸÃ¼k gÃ¼rÃ¼ltÃ¼, otomotiv/indÃ¼stri redÃ¼ktÃ¶rleri.",
        ],
      },
      {
        title: "2.3 Konik DiÅŸliler",
        points: [
          "Eksenleri kesiÅŸen miller iÃ§in; yÃ¼z geniÅŸliÄŸi boyunca modÃ¼l deÄŸiÅŸir.",
          "Spiral konik daha sessiz ve yÃ¼ksek yÃ¼k paylaÅŸÄ±mÄ± sunar; straight bevel daha basit ama gÃ¼rÃ¼ltÃ¼lÃ¼.",
          "Ä°malat ve kontrol: Ã¶zel takÄ±m/tezgah (Gleason/Klingelnberg) ve hassas ayar gerekir.",
        ],
      },
      {
        title: "2.4 Salyangoz (Worm) DiÅŸliler",
        points: [
          "YÃ¼ksek oran tek kademede (i â‰ˆ 20â€“80); kayma yÃ¼ksek, verim dÃ¼ÅŸer, Ä±sÄ± artar.",
          "Malzeme eÅŸleÅŸtirme: bronz Ã§ark + alaÅŸÄ±mlÄ± Ã§elik salyangoz; yaÄŸlama viskoz ve Ä±sÄ± kontrolÃ¼ kritik.",
          "Kendi kilitleme potansiyeli uygulamaya gÃ¶re kontrol edilmeli (helis aÃ§Ä±sÄ± ve sÃ¼rtÃ¼nmeye baÄŸlÄ±).",
        ],
      },
      {
        title: "2.5 Planet DiÅŸli Sistemleri",
        points: [
          "YÃ¼ksek tork yoÄŸunluÄŸu ve kompakt yapÄ±; gÃ¼neÅŸ, taÅŸÄ±yÄ±cÄ±, halka kombinasyonlarÄ±na gÃ¶re i belirlenir.",
          "YÃ¼k paylaÅŸÄ±mÄ±: taÅŸÄ±yÄ±cÄ± esnekliÄŸi, planet sayÄ±sÄ± ve tolerans zinciri kritik.",
          "GÃ¼rÃ¼ltÃ¼/denge: simetri ve aÄŸÄ±rlÄ±k daÄŸÄ±lÄ±mÄ± titreÅŸim/gÃ¼rÃ¼ltÃ¼yÃ¼ belirler.",
        ],
      },
      {
        title: "2.6 Zincir ve Kremayer DiÅŸliler",
        points: [
          "Kremayer: lineer hÄ±z = dairesel hÄ±z Â· Ï€Â·m; backlash ve hÄ±zalama Ã¶mrÃ¼ belirler.",
          "Zincir: hatve seÃ§imi, uzama ve yaÄŸlama planÄ±; sproket hatve toleransÄ± kritik.",
          "Hizalama ve germe ayarÄ± hem Ã¶mÃ¼r hem gÃ¼rÃ¼ltÃ¼ iÃ§in ana parametre.",
        ],
      },
    ],
  },
  {
    title: "3. DiÅŸli HesaplamalarÄ± (Ana Teknik Ä°Ã§erik)",
    intro:
      "TrafiÄŸin ana kaynaÄŸÄ± olacak hesap ve kontrol baÅŸlÄ±klarÄ±. Her alt baÅŸlÄ±k ileride otomatik hesaplayÄ±cÄ±ya dÃ¶nÃ¼ÅŸebilir.",
    items: [
      {
        title: "3.1 GÃ¼Ã§ â€“ Tork â€“ Gerilme HesaplamalarÄ±",
        points: [
          "DiÅŸli Ã§arkta Ã§evre kuvveti: Ft = 2*T / d",
          "EÅŸdeÄŸer diÅŸ yÃ¼zeyi basÄ±ncÄ± ve Hertz temas gerilmesi",
          "BÃ¼kÃ¼lme (Lewis formÃ¼lÃ¼) kontrolÃ¼",
          "DIN 3990 / ISO 6336'e gÃ¶re dayanÄ±m ve gÃ¼venlik katsayÄ±larÄ± (SF, SH)",
        ],
      },
      {
        title: "3.2 ModÃ¼l ve DiÅŸ SayÄ±sÄ± SeÃ§imi",
        points: [
          "ModÃ¼l seÃ§im tablolarÄ± ve tipik aralÄ±klar",
          "Ã‡ark Ã§apÄ± iÃ§in modÃ¼lâ€“diÅŸ sayÄ±sÄ± iliÅŸkisi",
          "Alt ve Ã¼st sÄ±nÄ±r baÄŸlamÄ±nda optimum diÅŸ sayÄ±sÄ± (z_min)",
          "Alt kesme (undercut) analizi ve profil kaydÄ±rma notu",
        ],
      },
      {
        title: "3.3 Helis DiÅŸli HesaplamalarÄ±",
        points: [
          "Normalâ€“esas modÃ¼l dÃ¶nÃ¼ÅŸÃ¼mÃ¼",
          "Helis aÃ§Ä±sÄ±nÄ±n yÃ¼k daÄŸÄ±lÄ±mÄ±na etkisi",
          "Aksiyel kuvvet hesaplarÄ± (Fa = Ft*tan beta)",
          "EÅŸdeÄŸer dÃ¼z diÅŸli modÃ¼lÃ¼ ile karÅŸÄ±laÅŸtÄ±rma",
        ],
      },
      {
        title: "3.4 BoÅŸluk (Backlash) HesabÄ±",
        points: [
          "Minimum â€“ nominal â€“ maksimum backlash tanÄ±mlarÄ±",
          "ISO 2768 benzeri tolerans mantÄ±ÄŸÄ± ile sÄ±nÄ±rlar",
          "Helisli sistemlerde backlash kontrolÃ¼",
          "Ä°mal/taÅŸlama toleranslarÄ± ile birleÅŸik not: taÅŸlama sonrasÄ± yÃ¼zeylerde +/-Âµm dÃ¼zeyleri",
        ],
      },
      {
        title: "3.5 YÃ¼zey Kalitesi ve Pinyon-Ã‡ark Uyumu",
        points: [
          "DiÅŸ yanaklarÄ±nÄ±n taÅŸlanmasÄ±, raspalama, form taÅŸlama",
          "Reishauer / Maag yÃ¶ntemlerinin yÃ¼ksek hÄ±zlarda yÃ¼zey kalitesine katkÄ±sÄ±",
          "Pinyon-Ã§ark uyumu iÃ§in eÅŸleÅŸtirilmiÅŸ taÅŸlama stratejisi",
        ],
      },
      {
        title: "3.6 Verim HesaplamalarÄ±",
        points: [
          "Helis diÅŸlide verim ve kayma bileÅŸeni etkisi",
          "Konik diÅŸlide verim",
          "Worm gear verimi (yaklaÅŸÄ±k %40â€“95 arasÄ±)",
        ],
      },
      {
        title: "3.7 GÃ¼rÃ¼ltÃ¼ â€“ TitreÅŸim â€“ NVH HesaplamalarÄ±",
        points: [
          "DiÅŸli temas oranÄ± artÄ±rma teknikleri",
          "Profil modifikasyonlarÄ±: tip relief, lead correction, crowning",
          "Ãœretim sapmalarÄ±nÄ±n NVH etkisi; tolerans ve hÄ±zalama kontrolleri",
        ],
      },
    ],
  },
  {
    title: "4. DiÅŸli Ãœretim MetotlarÄ±",
    intro:
      "PDF iÃ§eriÄŸi derin ve zengin; burada yÃ¶ntemleri aÃ§Ä±lÄ±r kartlarla Ã¶zetliyoruz. Her yÃ¶ntemin yanÄ±na animasyon/ÅŸema eklenebilir.",
    items: [
      {
        title: "4.1 Yuvarlanma Metodu (Genel)",
        points: [
          "Kremayer formu ile diÅŸ profilinin yuvarlanarak kesilmesi",
          "Senkron hareket: kesici ve iÅŸ parÃ§asÄ±nÄ±n diÅŸ sayÄ±sÄ±na gÃ¶re baÄŸlanan dÃ¶nÃ¼ÅŸ hÄ±zlarÄ±",
          "Animasyon/ÅŸema: kremayer bÄ±Ã§ak + diÅŸli Ã§ark hareket diyagramÄ±",
        ],
      },
      {
        title: "4.1.1 MAAG Sistemi",
        points: [
          "Planya hareketi: ileriâ€“geri tabla + diÅŸli dÃ¶nÃ¼ÅŸ senkronu",
          "Kremayer bÄ±Ã§akla iki yÃ¼zeyin aynÄ± anda kesimi",
          "ZÃ¼rih MAAG makinelerinin Ã§alÄ±ÅŸma diyagramlarÄ± (Ã§ift yÃ¼zey iÅŸleme)",
          "Avantaj: diÅŸ profili simetrisi yÃ¼ksek, hassasiyet iyi",
          "Dezavantaj: Ã§evrim sÃ¼resi uzun",
          "Animasyon/ÅŸema: planya stroku + kremayer bÄ±Ã§ak hareketi",
        ],
      },
      {
        title: "4.1.2 FELLOW Sistemi",
        points: [
          "DiÅŸli ÅŸeklinde kesici (pinion-type cutter) ile yuvarlanma",
          "YukarÄ± Ã§Ä±kÄ±ÅŸta dÃ¶nÃ¼ÅŸ â€“ aÅŸaÄŸÄ± iniÅŸte kesme prensibi",
          "Konik bÄ±Ã§ak ve eÄŸik tabla ayarÄ± ile profil uyumu",
          "ABD endÃ¼strisinde yaygÄ±n kullanÄ±m",
          "Animasyon/ÅŸema: diÅŸli kesici + iÅŸ parÃ§asÄ± senkron hareketi",
        ],
      },
      {
        title: "4.1.3 AzdÄ±rma (Hobbing) Sistemi",
        points: [
          "Sonsuz vida formunda hob ile sÃ¼rekli kesme (kontinÃ¼ freze)",
          "Radyal, eksenel ve kombinasyon talaÅŸ kaldÄ±rma yÃ¶ntemleri",
          "YÃ¼ksek verim; seri Ã¼retimde tercih",
          "Helis aÃ§Ä±sÄ± ayarlama: Î² â€“ Î³ iliÅŸkisi (helis aÃ§Ä±sÄ± ve hob sarmal aÃ§Ä±sÄ±)",
          "Ã‡ok aÄŸÄ±zlÄ± hob kullanÄ±mÄ± ve aÅŸÄ±nma problemi",
          "DIN kalite sÄ±nÄ±flarÄ±na gÃ¶re yÃ¼zey/doÄŸruluk hedefleri",
          "Animasyon/ÅŸema: hob + Ã§ark besleme yÃ¶nleri (radyal/eksenel)",
        ],
      },
      {
        title: "4.2 DÃ¶kÃ¼m DiÅŸliler",
        points: [
          "DÃ¼ÅŸÃ¼k hÄ±z â€“ yÃ¼ksek dayanÄ±m uygulamalarÄ±",
          "DÃ¶kÃ¼m hatalarÄ± ve tolerans kontrolÃ¼",
          "Model tasarÄ±m kriterleri (Ã§ekilme eÄŸimi, bÃ¼zÃ¼lme payÄ±)",
          "Kaynak notu: 12_05_dislilerin_uretimi",
          "Animasyon/ÅŸema: model + yolluk + besleyici Ã¶rneÄŸi",
        ],
      },
      {
        title: "4.3 ModÃ¼l Frezeleri",
        points: [
          "Form frezelerinin sÄ±nÄ±rlamalarÄ± (her diÅŸ sayÄ±sÄ± iÃ§in farklÄ± profil)",
          "Ã‡ok diÅŸ sayÄ±sÄ± iÃ§in farklÄ± takÄ±m ihtiyacÄ± â†’ stok/maliyet artar",
          "GÃ¼ncel Ã¼retimde tercih edilmeme sebepleri: esneklik ve hassasiyet dÃ¼ÅŸÃ¼klÃ¼ÄŸÃ¼",
        ],
      },
      {
        title: "4.4 Haddeleme â€“ Ovalama",
        points: [
          "SoÄŸuk/Ä±lÄ±k ÅŸekillendirme ile yÃ¼zey sertleÅŸtirme etkisi",
          "YÃ¼ksek Ã¶mÃ¼r, dÃ¼ÅŸÃ¼k talaÅŸ Ã§Ä±ktÄ±sÄ±; yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼ iyileÅŸir",
          "Hassasiyet: diÅŸ formunu doÄŸrudan Ã¼retmek iÃ§in kalÄ±p/doÄŸruluk kritik",
        ],
      },
      {
        title: "4.5 ZÄ±mbalama",
        points: [
          "Ã–nce sac/ince kesit diÅŸli parÃ§alar iÃ§in hÄ±zlÄ± yÃ¶ntem",
          "KalÄ±p Ã¶mrÃ¼ ve kenar Ã§izgisinin bÃ¼kÃ¼lme riskleri",
          "Ses ve hassasiyet gerektiren uygulamalarda sÄ±nÄ±rlÄ±",
        ],
      },
      {
        title: "4.6 Plastik â€“ PÃ¼skÃ¼rtme KalÄ±p DiÅŸliler",
        points: [
          "BÃ¼zÃ¼lme ve nem alÄ±mÄ± nedeniyle boyutsal dÃ¼zeltme gereksinimi",
          "Profil modifikasyonu ve Ã§arpÄ±lmayÄ± azaltacak kalÄ±p tasarÄ±mÄ±",
          "YÃ¼zey kalitesi ve NVH: malzeme seÃ§imi (PA, POM vb.) ve katkÄ±nÄ±n etkisi",
        ],
      },
      {
        title: "4.7 Sinterleme",
        points: [
          "GÃ¶zeneklilik â†’ yaÄŸ emdirme ile kendiliÄŸinden yaÄŸlama",
          "Boyutsal tolerans: sinterleme sonrasÄ± kalibrasyon/coining ihtiyacÄ±",
          "IsÄ±l iÅŸlem ve infiltrasyon ile mekanik dayanÄ±m iyileÅŸtirme",
        ],
      },
      {
        title: "4.8 BroÅŸlama",
        points: [
          "Ä°Ã§ diÅŸli ve spline iÃ§in tek geÃ§iÅŸte yÃ¼ksek doÄŸruluk",
          "TakÄ±m maliyeti yÃ¼ksek; seri Ã¼retimde verimli",
          "Ã‡ap ve diÅŸ sayÄ±sÄ± arttÄ±kÃ§a broÅŸ boyu/maliyeti artar",
        ],
      },
    ],
  },
  {
    title: "5. DiÅŸli Malzemeleri ve IsÄ±l Ä°ÅŸlemler",
    intro: "Ã‡elik sÄ±nÄ±flarÄ±, yÃ¼zey sertleÅŸtirme, temperleme ve mikro yapÄ± ile kalite iliÅŸkisi.",
    items: [
      {
        title: "5.1 Ã‡elik SafhalarÄ± (C45, 16MnCr5, 20MnCr5, 42CrMo4)",
        points: [
          "C45: orta karbon, indÃ¼ksiyonla yÃ¼zey sertleÅŸtirme; Ã§ekirdek tok.",
          "16MnCr5 / 20MnCr5: sementasyon iÃ§in dÃ¼ÅŸÃ¼k karbonlu alaÅŸÄ±mlar; yÃ¼zey sert, Ã§ekirdek tok.",
          "42CrMo4: temperlenebilir; yÃ¼ksek Ã§ekme ve yorulma dayanÄ±mÄ± gereken miller/diÅŸliler.",
          "SeÃ§im kriterleri: hedef sertlik, diÅŸ boyutu, darbeye maruziyet, maliyet.",
        ],
      },
      {
        title: "5.2 YÃ¼zey SertleÅŸtirme (Sementasyon, Nitrasyon)",
        points: [
          "Sementasyon: 0.8â€“1.2 mm karbonlama, ardÄ±ndan temperleme; yÃ¼ksek yÃ¼zey sertliÄŸi (58â€“62 HRC).",
          "Nitrasyon: dÃ¼ÅŸÃ¼k sÄ±caklÄ±k, dÃ¼ÅŸÃ¼k deformasyon; 0.2â€“0.6 mm derinlik, iyi aÅŸÄ±nma/yorulma direnci.",
          "SeÃ§im: diÅŸ boyutu, deformasyon toleransÄ±, yÃ¼k spektrumu ve maliyet.",
        ],
      },
      {
        title: "5.3 Temperleme ve Gerilim Giderme",
        points: [
          "Sementasyon sonrasÄ± dÃ¼ÅŸÃ¼k temp. temperleme ile kÄ±rÄ±lganlÄ±k azaltma.",
          "Nitrasyon Ã¶ncesi gerilim giderme: deformasyonu minimize eder.",
          "Ãœretim sÄ±rasÄ±: kaba iÅŸleme â†’ Ä±sÄ±l iÅŸlem â†’ taÅŸlama/honing.",
        ],
      },
      {
        title: "5.4 DiÅŸli Kalitesi â€“ Mikro YapÄ± Ä°liÅŸkisi",
        points: [
          "Martenzit yÃ¼zey + toklu Ã§ekirdek kombinasyonu yorulma Ã¶mrÃ¼nÃ¼ belirler.",
          "KarbÃ¼r daÄŸÄ±lÄ±mÄ± ve tane boyutu, pitting ve diÅŸ dibi Ã§atlaklarÄ±na karÅŸÄ± kritiktir.",
          "TaÅŸlama yanÄ±ÄŸÄ± mikro yapÄ±yÄ± bozarak erken pittinge yol aÃ§abilir.",
        ],
      },
      {
        title: "5.5 SÃ¼rÃ¼nme ve Yorulma DayanÄ±mÄ±",
        points: [
          "YÃ¼ksek sÄ±caklÄ±k/uzun sÃ¼reli yÃ¼kte sÃ¼rÃ¼nme; alaÅŸÄ±m ve sertlik seÃ§imi etkili.",
          "Yorulma dayanÄ±mÄ±: yÃ¼zey sertliÄŸi, sÄ±kÄ±ÅŸtÄ±rma kalÄ±ntÄ± gerilmeleri ve yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼ belirleyici.",
          "YaÄŸlama ve yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼ iyileÅŸtirmeleri (honing, superfinish) yorulma Ã¶mrÃ¼nÃ¼ artÄ±rÄ±r.",
        ],
      },
    ],
  },
  {
    title: "6. DiÅŸlilerde YaÄŸlama",
    intro:
      "PDFâ€™de detaylÄ± anlatÄ±lan yaÄŸlama stratejileri. Ã‡evre hÄ±zÄ± ve kuvvet-hÄ±z faktÃ¶rÃ¼ne gÃ¶re seÃ§im yapÄ±lÄ±r; tablo 1.1/1.2 referans alÄ±nabilir.",
    items: [
      {
        title: "6.1 YaÄŸlama TÃ¼rleri",
        points: [
          "SÃ¼rmeli (splash-on/brush): dÃ¼ÅŸÃ¼k/orta hÄ±zlar iÃ§in basit uygulama.",
          "DaldÄ±rma (sump/bath): Ã§arkÄ±n bir bÃ¶lÃ¼mÃ¼ yaÄŸ banyosuna girer; vÃ§ arttÄ±kÃ§a kayÄ±plara dikkat.",
          "PÃ¼skÃ¼rtme (spray/jet): yÃ¼ksek hÄ±z ve yÃ¼kte kontrollÃ¼ daÄŸÄ±lÄ±m; nozul yerleÅŸimi kritik.",
        ],
      },
      {
        title: "6.2 Ã‡evre HÄ±zÄ± vÃ§â€™ye GÃ¶re SeÃ§im",
        points: [
          "vÃ§ < ~8 m/s: daldÄ±rma yeterli; sÃ¼rmeli basit uygulamalarda kullanÄ±labilir.",
          "8â€“20 m/s: daldÄ±rma + yÃ¶nlendirilmiÅŸ sÄ±Ã§ratma; yaÄŸ kÃ¶pÃ¼klenmesi/taÅŸma kontrolÃ¼.",
          ">20 m/s: pÃ¼skÃ¼rtme/jetsiz olmaz; nozul aÃ§Ä±sÄ± ve debi hesaplanmalÄ±.",
          "Tablo 1.1 ve 1.2 (12_05_dislilerin_uretimi) doÄŸrudan iÅŸlenebilir.",
        ],
      },
      {
        title: "6.3 Viskozite SeÃ§imi",
        points: [
          "Ã‡evre hÄ±zÄ± ve yÃ¼k faktÃ¶rÃ¼ (ks / vÃ§) ile ISO VG seÃ§imi.",
          "DIN 51509 yaÄŸ sÄ±nÄ±flarÄ±: yÃ¼k/hÄ±z aralÄ±klarÄ±na gÃ¶re rehber.",
          "YÃ¼ksek hÄ±zda daha dÃ¼ÅŸÃ¼k viskozite, dÃ¼ÅŸÃ¼k hÄ±z/yÃ¼ksek torkta daha yÃ¼ksek viskozite tercih edilir.",
        ],
      },
      {
        title: "6.4 Kuvvetâ€“HÄ±z FaktÃ¶rÃ¼ (ks / vÃ§)",
        points: [
          "ks (N/mm) ve Ã§evre hÄ±zÄ± vÃ§ (m/s) birlikte deÄŸerlendirilir; yaÄŸ filmi kalÄ±nlÄ±ÄŸÄ± ve sÄ±caklÄ±k artÄ±ÅŸÄ± kontrol edilir.",
          "HesaplayÄ±cÄ± planÄ±: ks giriÅŸi, vÃ§ hesap, Ã¶nerilen ISO VG ve yaÄŸlama tipi.",
        ],
      },
      {
        title: "6.5 IsÄ± Tahkiki",
        points: [
          "GÃ¼Ã§ kaybÄ± â†’ Ä±sÄ± oluÅŸumu; banyoda sÄ±caklÄ±k artÄ±ÅŸÄ± tahmini gerekir.",
          "PÃ¼skÃ¼rtmede yaÄŸ debisi ve dÃ¶nÃ¼ÅŸ hattÄ± soÄŸutmasÄ± planlanmalÄ±.",
          "SÄ±caklÄ±k kontrolÃ¼ iÃ§in Ä±sÄ± eÅŸanjÃ¶rÃ¼/soÄŸutucu entegrasyonu.",
        ],
      },
      {
        title: "6.6 KÃ¶pÃ¼klenme, TaÅŸma, SoÄŸutma",
        points: [
          "KÃ¶pÃ¼k Ã¶nleyici katkÄ±lar ve uygun yaÄŸ seviyesi ile taÅŸma riski azaltÄ±lÄ±r.",
          "HavalandÄ±rma/tahliye (breather) tasarÄ±mÄ±; dÃ¶nÃ¼ÅŸ hattÄ±nda hava ayrÄ±ÅŸtÄ±rma.",
          "Nozul yerleÅŸimi yanlÄ±ÅŸsa sÄ±Ã§ratma kaybÄ± ve kÃ¶pÃ¼k artar; gÃ¶rsel kontrol Ã¶nerilir.",
        ],
      },
    ],
  },
  {
    title: "7. DiÅŸli KonstrÃ¼ksiyon Ä°ncelikleri",
    intro: "PDFâ€™deki kritik tasarÄ±m nÃ¼anslarÄ±: gÃ¶bek, disk/kaburga ve mil geÃ§mesi.",
    items: [
      {
        title: "7.1 GÃ¶bek TasarÄ±mÄ±",
        points: [
          "dGD â‰¥ 1.5Â·dM kriteri (gÃ¶bek dÄ±ÅŸ Ã§apÄ± â‰¥ 1.5Ã—diÅŸli modÃ¼lÃ¼*diÅŸ sayÄ±sÄ± / Ï€).",
          "Dolu malzeme â€“ dÃ¶vme â€“ dÃ¶kÃ¼m karÅŸÄ±laÅŸtÄ±rmasÄ±: dayanÄ±m, maliyet, Ã§arpÄ±lma riskleri.",
          "Transport delikleri ve aÄŸÄ±rlÄ±k optimizasyonu; balansÄ± etkilemeyecek simetrik yerleÅŸim.",
          "Kaynak notu: 12_05_dislilerin_uretimi.",
        ],
      },
      {
        title: "7.2 Disk â€“ Kaburga TasarÄ±mÄ±",
        points: [
          "Disk aÃ§Ä±sÄ± 8â€“12Â°: rijitlik ve dÃ¶kÃ¼mde kalÄ±p Ã§Ä±karma kolaylÄ±ÄŸÄ±.",
          "Kaburga kalÄ±nlÄ±ÄŸÄ±: moment yolu ve kaynak/dÃ¶kÃ¼m kalitesiyle uyumlu seÃ§ilmeli.",
          "Ã‡ember et kalÄ±nlÄ±ÄŸÄ±: termal/iÅŸleme payÄ± ve mukavemet iÃ§in minimum et.",
          "Kol sayÄ±sÄ±: zK â‰ˆ 0.125Â·d (hÄ±zlÄ± baÅŸlangÄ±Ã§ kuralÄ±); simetri ve balans dikkate alÄ±nÄ±r.",
          "Kaynak notu: 12_05_dislilerin_uretimi.",
        ],
      },
      {
        title: "7.3 Mil Ãœzerine GeÃ§me",
        points: [
          "Boyuna geÃ§me toleranslarÄ±: yÃ¼k yÃ¶nÃ¼ ve montaj koÅŸullarÄ±na gÃ¶re geÃ§me sÄ±nÄ±fÄ±.",
          "DiÅŸliâ€“mil baÄŸlantÄ± hesaplarÄ±: yÃ¼zey basÄ±ncÄ±, kayma ve emniyet katsayÄ±sÄ± kontrolÃ¼.",
          "Anahtar kanalÄ± vs frezeli mil: montaj kolaylÄ±ÄŸÄ±, tork kapasitesi ve yorulma etkisi karÅŸÄ±laÅŸtÄ±rmasÄ±.",
        ],
      },
    ],
  },
  {
    title: "8. Toleranslar ve Kalite SÄ±nÄ±flarÄ±",
    intro:
      "DIN 3960â€“3967, ISO 1328 Ã§erÃ§evesinde profil/hatve sapmalarÄ± ve Ã¼retim toleranslarÄ±; taÅŸlama ve raspalama etkisi.",
    items: [
      {
        title: "8.1 Standartlar",
        points: [
          "DIN 3960â€“3967: kalite sÄ±nÄ±flarÄ±, profil/hatve sapmasÄ± tanÄ±mlarÄ±.",
          "ISO 1328: helis/dÃ¼z diÅŸliler iÃ§in genel tolerans ve kalite sÄ±nÄ±flarÄ±.",
          "Kontrol yÃ¶ntemleri: hatve, profil ve runout Ã¶lÃ§Ã¼mleri.",
        ],
      },
      {
        title: "8.2 Profil SapmasÄ±",
        points: [
          "Tipik sapmalar: profile slope, profile form error.",
          "DÃ¼zeltmeler: profil modifikasyonu (tip relief) ile daÄŸÄ±lÄ±mÄ± iyileÅŸtirme.",
          "TaÅŸlama sonrasÄ± profil hassasiyeti yÃ¼kselir; yanÄ±k ve fazla malzeme alÄ±mÄ±na dikkat.",
        ],
      },
      {
        title: "8.3 Hatve SapmasÄ±",
        points: [
          "Tek hatve, toplam hatve, kumulatif sapma kontrolleri.",
          "Helisli diÅŸlilerde hatve Ã¶lÃ§Ã¼mÃ¼nde helis aÃ§Ä±sÄ±na baÄŸlÄ± dÃ¼zeltme.",
          "Raspalama/taÅŸlama ile hatve daÄŸÄ±lÄ±mÄ± iyileÅŸir; Ã¶lÃ§Ã¼m cihazÄ± seÃ§imi kritik.",
        ],
      },
      {
        title: "8.4 Tipik Ãœretim ToleranslarÄ±",
        points: [
          "Kaba iÅŸleme vs ince iÅŸleme: hedef kalite sÄ±nÄ±fÄ±na gÃ¶re tolerans daraltma.",
          "DIN kalite sÄ±nÄ±flarÄ± iÃ§in Ã¶rnek tolerans aralÄ±klarÄ± (p, f, F).",
          "IsÄ±l iÅŸlem sonrasÄ± deformasyon payÄ± ve taÅŸlama payÄ± planlama.",
        ],
      },
      {
        title: "8.5 TaÅŸlama SonrasÄ± Kalite ArtÄ±rma",
        points: [
          "Raspalama ve taÅŸlamanÄ±n toleransa etkisi: PDFâ€™de mÃ¼kemmel aÃ§Ä±klama (12_05_dislilerin_uretimi).",
          "TaÅŸlama yanÄ±ÄŸÄ± ve mikro yapÄ± bozulmasÄ± riskine karÅŸÄ± proses kontrolÃ¼.",
          "Superfinish/honing ile pÃ¼rÃ¼zlÃ¼lÃ¼k ve NVH iyileÅŸtirmesi.",
        ],
      },
    ],
  },
  {
    title: "9. DiÅŸli ArÄ±zalarÄ± ve Analizleri",
    intro: "Saha ve test arÄ±zalarÄ±; fotoÄŸraf/ÅŸema ile desteklenebilir. Pitting, scuffing, kÄ±rÄ±lma ve hizasÄ±zlÄ±k etkileri.",
    items: [
      {
        title: "9.1 Pitting (YÃ¼zey Ã‡ukurlaÅŸmasÄ±)",
        points: [
          "YÃ¼ksek yÃ¼zey basÄ±ncÄ± ve yaÄŸ filmi yetersizliÄŸinde mikro Ã§ukurlaÅŸma.",
          "Ã–nleme: doÄŸru viskozite, yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼ iyileÅŸtirme, yÃ¼k daÄŸÄ±lÄ±mÄ± (helis, profil modifikasyonu).",
          "Foto notu: Ã§ukur alanlar genelde hatve doÄŸrultusunda ilerler.",
        ],
      },
      {
        title: "9.2 Scuffing (YapÄ±ÅŸma/AÅŸÄ±nma)",
        points: [
          "YÃ¼ksek kayma + sÄ±caklÄ±k â†’ film kopmasÄ±; diÅŸ yanaklarÄ±nda mavi/kahverengi renklenme.",
          "Ã–nleme: EP katkÄ±lÄ± yaÄŸ, doÄŸru viskozite, yÃ¼zey Ä±sÄ±sÄ±nÄ± kontrol (pÃ¼skÃ¼rtme yaÄŸlama).",
          "Foto notu: sÃ¼rtÃ¼nme yÃ¶nÃ¼nde Ã§izgisel aÅŸÄ±nma izleri.",
        ],
      },
      {
        title: "9.3 Bending Fracture (DiÅŸ Dibi KÄ±rÄ±ÄŸÄ±)",
        points: [
          "YÃ¼ksek Ft + Ã§entik etkisi â†’ diÅŸ dibi Ã§atlaÄŸÄ±/kÄ±rÄ±ÄŸÄ±.",
          "Ã–nleme: yeterli diÅŸ dibi emniyeti (SF), uygun fillet yarÄ±Ã§apÄ±, kontrollÃ¼ Ä±sÄ±l iÅŸlem.",
          "Foto notu: kÃ¶kten baÅŸlayan kÄ±rÄ±k yÃ¼zey; Ã§oÄŸunlukla tek taraflÄ± yÃ¼k yÃ¶nÃ¼nde.",
        ],
      },
      {
        title: "9.4 Tooth Tip Fracture (DiÅŸ Ucu KÄ±rÄ±ÄŸÄ±)",
        points: [
          "YanlÄ±ÅŸ temas Ã§izgisi veya aÅŸÄ±rÄ± backlash â†’ diÅŸ ucu darbeleri.",
          "Ã–nleme: doÄŸru backlash ayarÄ±, profil modifikasyonu, hÄ±zalama kontrolÃ¼.",
          "Foto notu: diÅŸ ucunda lokal kopma ve kÄ±rÄ±k yÃ¼zeyi.",
        ],
      },
      {
        title: "9.5 Worn Flank (Yan YÃ¼zey AÅŸÄ±nmasÄ±)",
        points: [
          "YaÄŸlama yetersizliÄŸi veya kontaminasyon â†’ parlatÄ±lmÄ±ÅŸ/aÅŸÄ±nmÄ±ÅŸ yanak.",
          "Ã–nleme: filtre/temizlik, uygun yaÄŸ deÄŸiÅŸimi, pÃ¼rÃ¼zlÃ¼lÃ¼k kontrolÃ¼.",
          "Foto notu: geniÅŸ yÃ¼zeyde parlak aÅŸÄ±nma izi, pittingten farklÄ± olarak Ã§ukursuz.",
        ],
      },
      {
        title: "9.6 HizasÄ±zlÄ±k KaynaklÄ± ArÄ±zalar",
        points: [
          "YanlÄ±ÅŸ hÄ±zalama â†’ kenar yÃ¼klenmesi, lokal pitting/scuffing.",
          "Ã–nleme: ÅŸim/mesnet ayarÄ±, lead correction/crowning ile yÃ¼k daÄŸÄ±lÄ±mÄ± dÃ¼zeltme.",
          "Foto notu: sadece bir kenarda yoÄŸun hasar veya renk deÄŸiÅŸimi.",
        ],
      },
      {
        title: "9.7 YanlÄ±ÅŸ YaÄŸ Viskozitesi Etkileri",
        points: [
          "DÃ¼ÅŸÃ¼k viskozite: film kopmasÄ±, scuffing/pitting riski.",
          "YÃ¼ksek viskozite: sÃ¼rtÃ¼nme/Ä±sÄ± artÄ±ÅŸÄ±, enerji kaybÄ± ve kÃ¶pÃ¼klenme.",
          "Ã–nleme: Ã§evre hÄ±zÄ± + ks/vÃ§ faktÃ¶rÃ¼ne gÃ¶re doÄŸru ISO VG seÃ§imi; kÃ¶pÃ¼k Ã¶nleyici katkÄ± ve doÄŸru yaÄŸ seviyesi.",
        ],
      },
    ],
  },
  {
    title: "10. Online HesaplayÄ±cÄ±lar",
    intro:
      "ModÃ¼l, oran, kuvvet, backlash, helis aksiyel kuvvet ve yaÄŸ viskozitesi seÃ§ici gibi etkileÅŸimli araÃ§lar. AyrÄ± sayfada baÅŸlatÄ±labilir.",
    items: [
      {
        title: "10.1 ModÃ¼l HesaplayÄ±cÄ±",
        points: [
          "DiÅŸli boyutu ve diÅŸ sayÄ±sÄ±na gÃ¶re modÃ¼l hesaplama/Ã¶neri.",
          "Plan: diÅŸ sayÄ±sÄ±, Ã§ap, hedef kalite giriÅŸi; modÃ¼l ve tolerans Ã§Ä±ktÄ±sÄ±.",
        ],
      },
      {
        title: "10.2 DiÅŸli OranÄ± HesaplayÄ±cÄ±",
        points: [
          "z1 / z2 veya d1 / d2 ile oran ve devir iliÅŸkisi.",
          "Plan: rpm ve diÅŸ sayÄ±sÄ± giriÅŸi; Ã§Ä±kÄ±ÅŸta tork ve devir eÅŸlemesi.",
        ],
      },
      {
        title: "10.3 Ã‡evresel Kuvvet â€“ Tork HesaplayÄ±cÄ±",
        points: [
          "Ft = 2Â·T / d; Fr, Fa (heliste) otomatik hesap.",
          "Plan: gÃ¼Ã§, rpm, Ã§ap/modÃ¼l giriÅŸi; Ft/Fr/Fa Ã§Ä±ktÄ±sÄ±.",
        ],
      },
      {
        title: "10.4 Helis DiÅŸli Aksiyel Kuvvet HesaplayÄ±cÄ±",
        points: [
          "Fa = FtÂ·tanÎ²; helis aÃ§Ä±sÄ± ve basÄ±nÃ§ aÃ§Ä±sÄ±yla otomatik hesap.",
          "Plan: Î², Î±, gÃ¼Ã§, rpm giriÅŸi; Fa ve yatak yÃ¼kÃ¼ Ã§Ä±ktÄ±sÄ±.",
        ],
      },
      {
        title: "10.5 Backlash HesaplayÄ±cÄ±",
        points: [
          "Min/nom/max backlash; helis/dÃ¼z diÅŸli iÃ§in tolerans tabanlÄ±.",
          "Plan: modÃ¼l, kalite sÄ±nÄ±fÄ±, sÄ±caklÄ±k farkÄ± giriÅŸi; backlash sÄ±nÄ±rlarÄ± Ã§Ä±ktÄ±sÄ±.",
        ],
      },
      {
        title: "10.6 Kontak OranÄ± HesaplayÄ±cÄ±",
        points: [
          "ÎµÎ± ve ÎµÎ² hesaplarÄ±; profil/hatve oranÄ± ile gÃ¼rÃ¼ltÃ¼ tahmini.",
          "Plan: modÃ¼l, basÄ±nÃ§ aÃ§Ä±sÄ±, diÅŸ sayÄ±sÄ±, helis aÃ§Ä±sÄ± giriÅŸi; temas oranÄ± Ã§Ä±ktÄ±sÄ±.",
        ],
      },
      {
        title: "10.7 YaÄŸ Viskozitesi SeÃ§ici (ks/vÃ§ grafiÄŸi)",
        points: [
          "ks ve Ã§evre hÄ±zÄ± vÃ§ giriÅŸiyle ISO VG Ã¶nerisi.",
          "Plan: tablo 1.1/1.2 referanslÄ±; daldÄ±rma/pÃ¼skÃ¼rtme seÃ§imi.",
        ],
      },
      {
        title: "10.8 DiÅŸli AÄŸÄ±rlÄ±ÄŸÄ± â€“ GÃ¶vde Optimizasyon HesaplayÄ±cÄ±",
        points: [
          "DiÅŸli geometrisi + boÅŸaltma delikleri/kaburga sayÄ±sÄ± ile aÄŸÄ±rlÄ±k tahmini.",
          "Plan: d, b, malzeme yoÄŸunluÄŸu, boÅŸaltma oranÄ± giriÅŸi; aÄŸÄ±rlÄ±k ve tasarruf Ã§Ä±ktÄ±sÄ±.",
        ],
      },
    ],
  },
  {
    title: "11. DiÅŸli Ãœretim SimÃ¼lasyonlarÄ±",
    intro: "Ãœniversite ve meslek lisesi Ã¶ÄŸrencileri iÃ§in hareket/iÅŸleme animasyonlarÄ±; ayrÄ± sayfada aÃ§Ä±labilir.",
    items: [
      {
        title: "11.1 MAAG Sistemi Hareket Animasyonu",
        points: [
          "Planya stroku ve kremayer bÄ±Ã§ak hareketi senkronu.",
          "Ã‡ift yÃ¼zey iÅŸleme diyagramÄ±; hÄ±z ve strok ayarÄ± gÃ¶sterimi.",
        ],
      },
      {
        title: "11.2 FELLOW Sistemi DinamiÄŸi",
        points: [
          "DiÅŸli ÅŸeklinde kesici ile yukarÄ± Ã§Ä±kÄ±ÅŸta dÃ¶nÃ¼ÅŸ â€“ aÅŸaÄŸÄ± iniÅŸte kesme hareketi.",
          "Kesici/iÅŸ parÃ§asÄ± senkronizasyonu; eÄŸik tabla ayarÄ± gÃ¶rselleÅŸtirme.",
        ],
      },
      {
        title: "11.3 AzdÄ±rma (Hobbing) Kesim Animasyonu",
        points: [
          "Hob sarmal hareketi, besleme yÃ¶nleri (radyal/eksenel) ve helis aÃ§Ä±sÄ± ayarÄ±.",
          "Ã‡ok aÄŸÄ±zlÄ± hob aÅŸÄ±nma ve yÃ¼zey oluÅŸumunun gÃ¶sterimi.",
        ],
      },
      {
        title: "11.4 TaÅŸlama SimÃ¼lasyonu",
        points: [
          "Profil taÅŸlama vs form taÅŸlama; yanma riski ve soÄŸutma akÄ±ÅŸÄ± gÃ¶rselleÅŸtirme.",
          "Honing/superfinish sonrasÄ± pÃ¼rÃ¼zlÃ¼lÃ¼k etkisi.",
        ],
      },
      {
        title: "11.5 DÃ¶kÃ¼m SoÄŸuma Animasyonu",
        points: [
          "Besleyici/maÃ§a yerleÅŸimi ve katÄ±laÅŸma sÄ±rasÄ±; bÃ¼zÃ¼lme risk alanlarÄ±.",
          "SoÄŸutma kanalÄ±/izolasyon ile kusur Ã¶nleme senaryolarÄ±.",
        ],
      },
    ],
  },
];

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("gear-design", locale);
}

export default async function GearDesignPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design", locale);
  const calculatorsHref = withLocalePrefix("/tools/gear-design/calculators", locale);
  const simulationsHref = withLocalePrefix("/tools/gear-design/simulations", locale);
  return (
    <>
      <ToolSeo toolId="gear-design" locale={locale} />

    <PageShell>
      <ToolDocTabs slug="gear-design" initialDocs={initialDocs}>
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              DiÅŸli HesaplamalarÄ± ve DiÅŸli TasarÄ±m Ä°ncelikleri
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              GeliÅŸtiriliyor
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            DiÅŸli temelleri, tipleri, hesaplamalar ve Ã¼retim metotlarÄ± iÃ§in aÃ§Ä±lÄ±r bilgi kartlarÄ±
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            DÃ¶rt ana baÅŸlÄ±k altÄ±nda aÃ§Ä±lÄ±r kartlar: (1) Temeller, (2) Tipler, (3) Hesaplamalar, (4) Ãœretim
            metotlarÄ±. Her kartÄ± geniÅŸleterek maddeleri okuyabilirsin; ileride hesap modÃ¼lleri ve PDF baÄŸlantÄ±larÄ±
            eklenecek.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
                <p className="text-sm text-slate-700">{section.intro}</p>
                {section.title.startsWith("10.") && (
                  <Link
                    href={calculatorsHref}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                  >
                    Online hesaplayÄ±cÄ±larÄ± aÃ§
                    <span className="text-[12px]">â†’</span>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                  AÃ§Ä±lÄ±r kartlar
                </span>
                {section.title.startsWith("11.") && (
                  <Link
                    href={simulationsHref}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    SimÃ¼lasyon sayfasÄ±nÄ± aÃ§
                  </Link>
                )}
              </div>
            </header>

            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <details
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300"
                  {...(idx === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold text-slate-900 outline-none">
                    <span className="break-words">{item.title}</span>
                    <span className="text-[11px] font-medium text-slate-500 group-open:text-slate-700">
                      {idx === 0 ? "AÃ§Ä±k" : "AÃ§"}
                    </span>
                  </summary>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12px] leading-relaxed text-slate-700">
                    {item.points.map((p) => (
                      <li key={p} className="break-words">
                        {p}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </article>
        ))}
      </section>
          </ToolDocTabs>
    </PageShell>
  
    </>
  );
}




