const fs = require("fs");
const path = require("path");

const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  PageBreak,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("/tmp/mawd-docx/node_modules/docx");

const OUT = path.join(__dirname, "mawd-introduction-v2-visual.docx");
const W = 13200;
const COLORS = {
  ink: "172033",
  muted: "5B6475",
  line: "D9DEE8",
  pale: "F4F7FB",
  navy: "182B49",
  blue: "2F6BFF",
  sky: "E8F1FF",
  mint: "DDF7ED",
  green: "138A5B",
  amber: "FFF2CC",
  orange: "C56A1B",
  coral: "FFE9E4",
  red: "B64234",
  dark: "0D1B2A",
  white: "FFFFFF",
};

const border = (color = COLORS.line, size = 1) => ({
  style: BorderStyle.SINGLE,
  color,
  size,
});
const borders = (color = COLORS.line) => ({
  top: border(color),
  bottom: border(color),
  left: border(color),
  right: border(color),
});
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: "Arial",
    color: opts.color || COLORS.ink,
    size: opts.size || 22,
    bold: !!opts.bold,
    italics: !!opts.italics,
    break: opts.break || 0,
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 100, line: opts.line || 300 },
    heading: opts.heading,
    children: Array.isArray(text) ? text : [run(text, opts)],
  });
}

function h(text) {
  return p(text, { heading: HeadingLevel.HEADING_1, size: 28, bold: true, color: COLORS.navy, before: 180, after: 100 });
}

function sub(text) {
  return p(text, { size: 18, color: COLORS.muted, after: 180 });
}

function cell(children, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: opts.valign || VerticalAlign.CENTER,
    borders: opts.borderless ? noBorders : borders(opts.border || COLORS.line),
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: opts.mt || 140, bottom: opts.mb || 140, left: opts.ml || 160, right: opts.mr || 160 },
    children: Array.isArray(children) ? children : [children],
  });
}

function table(widths, rows, opts = {}) {
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: widths,
    borders: opts.borderless ? noBorders : borders(opts.border || COLORS.line),
    rows: rows.map((row) => new TableRow({
      children: row.map((item, i) => {
        if (item instanceof TableCell) return item;
        return cell(item, widths[i]);
      }),
    })),
  });
}

function tag(text, fill, color = COLORS.ink) {
  return p([run(text, { bold: true, color, size: 18 })], { align: AlignmentType.CENTER, after: 0 });
}

function statCard(label, value, note, fill, color) {
  return cell([
    p(label, { size: 16, color, bold: true, after: 20 }),
    p(value, { size: 30, color, bold: true, after: 40 }),
    p(note, { size: 17, color: COLORS.muted, after: 0, line: 240 }),
  ], 3300, { fill, border: fill, mt: 220, mb: 220 });
}

function stepBox(num, title, body, fill, color) {
  return cell([
    tag(`STEP ${num}`, fill, color),
    p(title, { size: 20, bold: true, color, align: AlignmentType.CENTER, after: 50 }),
    p(body, { size: 16, color: COLORS.muted, align: AlignmentType.CENTER, after: 0, line: 230 }),
  ], 2200, { fill, border: "FFFFFF", mt: 160, mb: 160 });
}

function sourceNote() {
  return [
    p("참고한 소개서 패턴", { size: 18, bold: true, color: COLORS.navy, before: 160, after: 60 }),
    p("IR 경진대회·데모데이 모집 자료들은 참여 대상, 지원 내용, 일정, 평가/피드백, 후속 투자 연결을 표로 먼저 보여주는 구성이 많았습니다. 마우드 v2는 이 구조를 참고하되, 가상머니 투자와 상금 전환이라는 게임룰을 차별화 포인트로 전면 배치했습니다.", {
      size: 17,
      color: COLORS.muted,
      line: 260,
    }),
  ];
}

const cardPath = path.join(__dirname, "cards-png", "mawd-card-01.png");
const coverImage = fs.existsSync(cardPath)
  ? new ImageRun({ data: fs.readFileSync(cardPath), type: "png", transformation: { width: 240, height: 240 } })
  : null;

const children = [
  table([7600, 5600], [[
    cell([
      p("마우드 mawd", { size: 18, color: COLORS.blue, bold: true, after: 80 }),
      p("AI 창업 서바이벌 프로그램 소개서", { size: 42, color: COLORS.dark, bold: true, after: 80, line: 520 }),
      p("아이디어를 PRD로 만들고, MVP로 검증하고, 심사위원·기업의 가상 투자를 받아 상금으로 연결하는 실행형 창업 프로그램", { size: 21, color: COLORS.muted, line: 320 }),
    ], 7600, { borderless: true }),
    cell([
      ...(coverImage ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [coverImage] })] : []),
      p("PRD → MVP → 가상투자 → 상금", { size: 20, bold: true, color: COLORS.navy, align: AlignmentType.CENTER, before: 120 }),
      p("교육보다 실행, 발표보다 검증, 점수보다 투자 판단", { size: 17, color: COLORS.muted, align: AlignmentType.CENTER }),
    ], 5600, { fill: COLORS.pale, border: COLORS.pale, mt: 360, mb: 360 }),
  ]], { borderless: true }),

  table([4400, 4400, 4400], [[
    statCard("핵심 산출물", "PRD + MVP", "말로 설명하는 아이디어가 아니라 문서, 링크, 제품 결과물로 남깁니다.", COLORS.sky, COLORS.blue),
    statCard("평가 방식", "가상 투자", "심사위원과 기업이 팀별 결과물에 가상머니로 투자합니다.", COLORS.mint, COLORS.green),
    statCard("보상 구조", "투자액 = 상금", "최종 상금은 팀이 받은 가상머니와 직접 연결됩니다.", COLORS.amber, COLORS.orange),
  ]], { borderless: true }),

  h("1. 한눈에 보는 프로그램"),
  table([2700, 10500], [
    [cell([p("프로그램 성격", { bold: true, color: COLORS.white, after: 0 })], 2700, { fill: COLORS.navy, border: COLORS.navy }), p("AI 도구를 활용해 아이디어를 실제 프로젝트로 만드는 라운드형 창업 서바이벌")],
    [cell([p("참가 대상", { bold: true, color: COLORS.white, after: 0 })], 2700, { fill: COLORS.navy, border: COLORS.navy }), p("창업 아이디어는 있지만 개발·검증·발표 경험이 부족한 예비창업자, 대학생, 사이드프로젝트 팀")],
    [cell([p("핵심 경험", { bold: true, color: COLORS.white, after: 0 })], 2700, { fill: COLORS.navy, border: COLORS.navy }), p("PRD 작성, AI MVP 제작, 배포 링크 등록, 심사위원·기업 가상투자, 피어리뷰, 최종 시상")],
    [cell([p("차별점", { bold: true, color: COLORS.white, after: 0 })], 2700, { fill: COLORS.navy, border: COLORS.navy }), p("평가 점수 대신 가상머니를 사용해 투자 판단을 시뮬레이션하고, 받은 가상머니를 상금 구조와 연결")],
  ]),

  h("2. 기존 창업 프로그램과의 차이"),
  table([3000, 3400, 3400, 3400], [
    [
      cell([p("구분", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3000, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("일반 창업 교육", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3400, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("일반 발표 대회", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3400, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("마우드", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3400, { fill: COLORS.blue, border: COLORS.blue }),
    ],
    [p("핵심 목표", { bold: true }), p("학습과 이해"), p("발표와 수상"), p("실제 결과물 제작과 투자형 검증")],
    [p("주요 산출물", { bold: true }), p("강의 수강, 과제"), p("발표자료"), p("PRD, MVP, 배포 링크, 피드백 기록")],
    [p("평가 방식", { bold: true }), p("출석·과제 중심"), p("심사 점수 중심"), p("심사위원·기업의 가상머니 투자")],
    [p("참가자 동기", { bold: true }), p("배움"), p("수상"), p("살아남고, 투자받고, 상금으로 전환")],
  ]),

  h("3. 프로그램 플로우"),
  sub("참가자는 아이디어를 가지고 들어와 PRD, MVP, 투자 피드백, 상금 기회까지 경험합니다."),
  table([2200, 2200, 2200, 2200, 2200, 2200], [[
    stepBox("1", "모집", "아이디어 보유 참가자/팀 선발", COLORS.sky, COLORS.blue),
    stepBox("2", "오리엔테이션", "룰, 일정, 평가 방식 공개", COLORS.pale, COLORS.navy),
    stepBox("3", "1차 빌딩", "AI 툴 세팅과 PRD 제작", COLORS.mint, COLORS.green),
    stepBox("4", "링크 등록", "산출물과 배포 링크 제출", COLORS.pale, COLORS.navy),
    stepBox("5", "가상투자", "심사위원·기업 투자 판단", COLORS.amber, COLORS.orange),
    stepBox("6", "MVP 결선", "생존팀 대면 빌딩과 최종 상금", COLORS.coral, COLORS.red),
  ]], { borderless: true }),

  h("4. 라운드별 산출물과 평가 포인트"),
  table([2200, 2900, 3900, 4200], [
    [
      cell([p("라운드", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 2200, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("진행 방식", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 2900, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("참가자 산출물", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3900, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("평가 포인트", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4200, { fill: COLORS.navy, border: COLORS.navy }),
    ],
    [p("1차"), p("비대면 빌딩"), p("문제 정의, 타깃 고객, 핵심 기능, PRD 초안"), p("문제의 선명도, 고객 이해, 실행 가능성")],
    [p("등록"), p("온라인 제출"), p("팀별 산출물, 링크, 설명자료"), p("짧은 시간 안에 이해되는 설득력")],
    [p("투자 평가"), p("온라인 심사"), p("PRD와 링크 기반 결과물"), p("심사위원·기업이 가상머니로 투자할 만큼의 가능성")],
    [p("2차"), p("대면 MVP 빌딩"), p("실제 작동하는 MVP, 데모 링크, 개선 로그"), p("제품 완성도, 검증력, 팀 실행력")],
    [p("최종"), p("피어리뷰·시상"), p("동료 리뷰와 최종 발표"), p("받은 가상머니, 성장 폭, 시장 가능성")],
  ]),

  h("5. 가상머니 투자와 상금 구조"),
  table([4400, 4400, 4400], [[
    cell([
      p("01. 심사위원·기업 배정", { size: 20, bold: true, color: COLORS.blue }),
      p("각 심사위원과 기업은 제한된 가상머니를 보유합니다. 모든 팀에 고르게 주는 것이 아니라, 가능성이 높은 팀에 투자합니다.", { size: 17, color: COLORS.muted, line: 250 }),
    ], 4400, { fill: COLORS.sky, border: COLORS.sky }),
    cell([
      p("02. 팀별 투자 누적", { size: 20, bold: true, color: COLORS.green }),
      p("팀은 PRD, MVP, 배포 링크, 발표를 통해 가상머니를 획득합니다. 누적 금액이 라운드 통과와 최종 순위를 결정합니다.", { size: 17, color: COLORS.muted, line: 250 }),
    ], 4400, { fill: COLORS.mint, border: COLORS.mint }),
    cell([
      p("03. 상금으로 전환", { size: 20, bold: true, color: COLORS.orange }),
      p("최종 라운드에서 받은 가상머니는 실제 상금 배분 기준으로 전환됩니다. 즉, 설득력 있는 팀이 더 큰 보상을 가져갑니다.", { size: 17, color: COLORS.muted, line: 250 }),
    ], 4400, { fill: COLORS.amber, border: COLORS.amber }),
  ]], { borderless: true }),
  table([2600, 3000, 3600, 4000], [
    [
      cell([p("예시 팀", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 2600, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("획득 가상머니", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3000, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("투자 그래프", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3600, { fill: COLORS.dark, border: COLORS.dark }),
      cell([p("상금 전환 의미", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4000, { fill: COLORS.dark, border: COLORS.dark }),
    ],
    [p("A팀"), p("1,200만 머니"), p("████████████", { color: COLORS.blue, bold: true }), p("최종 상금 배분의 가장 큰 비중")],
    [p("B팀"), p("850만 머니"), p("████████", { color: COLORS.green, bold: true }), p("상위권 생존 및 수상 후보")],
    [p("C팀"), p("420만 머니"), p("████", { color: COLORS.orange, bold: true }), p("개선 피드백 후 재도전 후보")],
  ]),

  h("6. 참여자와 파트너가 얻는 가치"),
  table([4400, 4400, 4400], [
    [
      cell([p("참가자", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4400, { fill: COLORS.blue, border: COLORS.blue }),
      cell([p("주최기관", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4400, { fill: COLORS.green, border: COLORS.green }),
      cell([p("기업·심사위원", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4400, { fill: COLORS.orange, border: COLORS.orange }),
    ],
    [
      p("실제 PRD와 MVP 포트폴리오 확보\nAI 도구 기반 제품 제작 경험\n투자형 피드백과 동료 리뷰 획득", { line: 300 }),
      p("단순 교육이 아닌 결과물 중심 프로그램 운영\n참가자 성과를 링크와 산출물로 축적\n지역·학교·기관 창업 생태계 브랜딩 강화", { line: 300 }),
      p("초기 아이디어와 팀 실행력을 조기에 확인\n실제 투자 관점으로 평가 경험 제공\n관심 팀과 후속 미팅·협업 가능성 확보", { line: 300 }),
    ],
  ]),

  h("7. 운영 일정 예시"),
  table([2400, 3000, 4400, 3400], [
    [
      cell([p("구간", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 2400, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("방식", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3000, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("주요 내용", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 4400, { fill: COLORS.navy, border: COLORS.navy }),
      cell([p("확인 산출물", { bold: true, color: COLORS.white, align: AlignmentType.CENTER, after: 0 })], 3400, { fill: COLORS.navy, border: COLORS.navy }),
    ],
    [p("D-14 ~ D-1"), p("온라인 모집"), p("참가자/팀 모집, 아이디어 접수, 사전 안내"), p("신청서, 아이디어 요약")],
    [p("Day 1"), p("대면"), p("오리엔테이션, 룰 공개, 팀 세팅, AI 툴 안내"), p("팀 구성, 주제 확정")],
    [p("Day 2 ~ 7"), p("비대면"), p("PRD 작성, 문제 정의, 핵심 기능 구체화"), p("PRD 초안, 링크 등록")],
    [p("Day 8"), p("온라인"), p("심사위원·기업 가상머니 투자 평가"), p("가상머니 순위, 피드백")],
    [p("Day 9 ~ 13"), p("대면/비대면 혼합"), p("생존팀 MVP 제작, 피어리뷰, 개선"), p("MVP, 데모 링크")],
    [p("Day 14"), p("대면"), p("최종 발표, 투자 결과 발표, 상금 지급"), p("최종 순위, 시상")],
  ]),

  h("8. 신청 안내에 들어갈 정보"),
  table([3300, 9900], [
    [cell([p("모집 대상", { bold: true, color: COLORS.white, after: 0 })], 3300, { fill: COLORS.dark, border: COLORS.dark }), p("예비창업자, 대학생, 직장인, 사이드프로젝트 팀 등 아이디어를 실제 결과물로 만들고 싶은 사람")],
    [cell([p("모집 규모", { bold: true, color: COLORS.white, after: 0 })], 3300, { fill: COLORS.dark, border: COLORS.dark }), p("운영 여건에 따라 팀 단위 또는 개인 단위로 설정")],
    [cell([p("참가비", { bold: true, color: COLORS.white, after: 0 })], 3300, { fill: COLORS.dark, border: COLORS.dark }), p("무료 또는 유료 여부 확정 필요")],
    [cell([p("준비물", { bold: true, color: COLORS.white, after: 0 })], 3300, { fill: COLORS.dark, border: COLORS.dark }), p("노트북, 창업 아이디어, 협업 가능한 온라인 계정, AI 도구 사용 환경")],
    [cell([p("신청 CTA", { bold: true, color: COLORS.white, after: 0 })], 3300, { fill: COLORS.dark, border: COLORS.dark }), p("마우드 참가 신청하기 / 팀으로 도전하기 / 내 아이디어 투자받기")],
  ]),

  ...sourceNote(),
  new Paragraph({ children: [new PageBreak()] }),

  h("부록. 홍보용 핵심 문구"),
  table([3800, 9400], [
    [cell([p("메인 카피", { bold: true, color: COLORS.white, after: 0 })], 3800, { fill: COLORS.blue, border: COLORS.blue }), p("아이디어를 실제 프로젝트로 바꾸는 AI 창업 서바이벌")],
    [cell([p("서브 카피", { bold: true, color: COLORS.white, after: 0 })], 3800, { fill: COLORS.blue, border: COLORS.blue }), p("PRD를 만들고, MVP를 제작하고, 심사위원과 기업의 가상 투자를 받아보세요. 최종 상금은 팀이 받은 가상머니만큼 지급됩니다.")],
    [cell([p("짧은 설명", { bold: true, color: COLORS.white, after: 0 })], 3800, { fill: COLORS.blue, border: COLORS.blue }), p("마우드는 교육보다 실행에 가까운 프로그램입니다. 참가자는 AI 도구로 아이디어를 제품화하고, 결과물을 링크로 등록한 뒤, 투자형 피드백을 받습니다.")],
    [cell([p("CTA", { bold: true, color: COLORS.white, after: 0 })], 3800, { fill: COLORS.blue, border: COLORS.blue }), p("마우드 참가 신청하기")],
  ]),
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: COLORS.ink } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Arial", size: 28, bold: true, color: COLORS.navy },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 500, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE },
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT, buffer);
  console.log(OUT);
});
