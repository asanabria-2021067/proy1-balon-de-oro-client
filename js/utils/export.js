import { getCeremonies, getCeremonyByYear } from '../core/api.js';
import { showToast } from '../views/toast.view.js';

export async function exportToCSV() {
    showToast('Preparando exportación CSV...', 'success');
    try {
        const ceremoniesList = await getCeremonies();
        let allData = [];

        for (const c of ceremoniesList) {
            const detail = await getCeremonyByYear(c.year);
            detail.nominations.forEach(n => {
                allData.push({
                    year: detail.year,
                    rank: n.rank,
                    player: n.player.name,
                    nationality: n.player.nationality,
                    club: n.player.club,
                    position: n.player.position,
                    votes: n.votesReceived || 0,
                    avgRating: n.averageRating || 0,
                    winner: n.rank === 1 ? 'Sí' : 'No'
                });
            });
        }

        const headers = ['Año', 'Puesto', 'Jugador', 'Nacionalidad', 'Club', 'Posición', 'Votos', 'Calificación Promedio', 'Ganador'];
        let csvContent = headers.join(',') + '\n';

        allData.forEach(row => {
            csvContent += [
                row.year,
                row.rank,
                `"${row.player.replace(/"/g, '""')}"`,
                `"${row.nationality.replace(/"/g, '""')}"`,
                `"${row.club.replace(/"/g, '""')}"`,
                row.position,
                row.votes,
                row.avgRating.toFixed(2),
                row.winner
            ].join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'balon-de-oro.csv');
        link.click();

    } catch (error) {
        showToast('Error al exportar CSV', 'error');
    }
}

export async function exportToExcel() {
    showToast('Preparando exportación Excel...', 'success');
    try {
        const zip = new JSZip();

        const ceremoniesList = await getCeremonies();
        let allData = [];

        for (const c of ceremoniesList) {
            const detail = await getCeremonyByYear(c.year);
            detail.nominations.forEach(n => {
                allData.push({
                    year: detail.year,
                    rank: n.rank,
                    player: n.player.name,
                    nationality: n.player.nationality,
                    club: n.player.club,
                    position: n.player.position,
                    votes: n.votesReceived || 0,
                    avgRating: n.averageRating || 0,
                    winner: n.rank === 1 ? 'Sí' : 'No'
                });
            });
        }

        const sharedStrings = ['Año', 'Puesto', 'Jugador', 'Nacionalidad', 'Club', 'Posición', 'Votos', 'Calificación Promedio', 'Ganador'];
        allData.forEach(row => {
            if (!sharedStrings.includes(row.player)) sharedStrings.push(row.player);
            if (!sharedStrings.includes(row.nationality)) sharedStrings.push(row.nationality);
            if (!sharedStrings.includes(row.club)) sharedStrings.push(row.club);
            if (!sharedStrings.includes(row.position)) sharedStrings.push(row.position);
            if (!sharedStrings.includes(row.winner)) sharedStrings.push(row.winner);
        });

        let sheetData = '<row r="1">';
        sheetData += '<c r="A1" t="s" s="1"><v>0</v></c>';
        sheetData += '<c r="B1" t="s" s="1"><v>1</v></c>';
        sheetData += '<c r="C1" t="s" s="1"><v>2</v></c>';
        sheetData += '<c r="D1" t="s" s="1"><v>3</v></c>';
        sheetData += '<c r="E1" t="s" s="1"><v>4</v></c>';
        sheetData += '<c r="F1" t="s" s="1"><v>5</v></c>';
        sheetData += '<c r="G1" t="s" s="1"><v>6</v></c>';
        sheetData += '<c r="H1" t="s" s="1"><v>7</v></c>';
        sheetData += '<c r="I1" t="s" s="1"><v>8</v></c>';
        sheetData += '</row>';

        allData.forEach((row, idx) => {
            const rowNum = idx + 2;
            sheetData += `<row r="${rowNum}">`;
            sheetData += `<c r="A${rowNum}"><v>${row.year}</v></c>`;
            sheetData += `<c r="B${rowNum}"><v>${row.rank}</v></c>`;
            sheetData += `<c r="C${rowNum}" t="s"><v>${sharedStrings.indexOf(row.player)}</v></c>`;
            sheetData += `<c r="D${rowNum}" t="s"><v>${sharedStrings.indexOf(row.nationality)}</v></c>`;
            sheetData += `<c r="E${rowNum}" t="s"><v>${sharedStrings.indexOf(row.club)}</v></c>`;
            sheetData += `<c r="F${rowNum}" t="s"><v>${sharedStrings.indexOf(row.position)}</v></c>`;
            sheetData += `<c r="G${rowNum}"><v>${row.votes}</v></c>`;
            sheetData += `<c r="H${rowNum}"><v>${row.avgRating.toFixed(2)}</v></c>`;
            sheetData += `<c r="I${rowNum}" t="s"><v>${sharedStrings.indexOf(row.winner)}</v></c>`;
            sheetData += '</row>';
        });

        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

        const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

        const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
<sheet name="Balón de Oro" sheetId="1" r:id="rId1"/>
</sheets>
</workbook>`;

        const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${sheetData}</sheetData>
</worksheet>`;

        let sharedStringsXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${sharedStrings.length}" uniqueCount="${sharedStrings.length}">`;
        sharedStrings.forEach(str => {
            sharedStringsXML += `<si><t>${str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</t></si>`;
        });
        sharedStringsXML += '</sst>';

        const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

        const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
</fonts>
<fills count="1">
<fill><patternFill patternType="none"/></fill>
</fills>
<borders count="1">
<border><left/><right/><top/><bottom/><diagonal/></border>
</borders>
<cellXfs count="2">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0"/>
</cellXfs>
</styleSheet>`;

        zip.file('[Content_Types].xml', contentTypes);
        zip.file('_rels/.rels', rels);
        zip.file('xl/workbook.xml', workbook);
        zip.file('xl/worksheets/sheet1.xml', worksheet);
        zip.file('xl/sharedStrings.xml', sharedStringsXML);
        zip.file('xl/_rels/workbook.xml.rels', workbookRels);
        zip.file('xl/styles.xml', styles);

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'balon-de-oro.xlsx';
        a.click();

    } catch (error) {
        showToast('Error al exportar Excel', 'error');
    }
}
