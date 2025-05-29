import DataManager from "./dataManager.js";
const { jsPDF } = window.jspdf;

const dataManager = new DataManager("Contribuciones");

document.addEventListener("DOMContentLoaded", () => {
    const chkTodas = document.getElementById("chkTodasCategorias");
    const divCategorias = document.getElementById("categoriaCheckboxes");
    const btnGenerar = document.getElementById("btnGenerarReportePDF");

    const contribuciones = dataManager.readData();
    const categoriasUnicas = [...new Set(contribuciones.map(c => c.categoria))];

    categoriasUnicas.forEach(categoria => {
        const div = document.createElement("div");
        div.className = "form-check";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.value = categoria;
        input.id = `chk-${categoria}`;
        input.name = "categorias";

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = input.id;
        label.textContent = categoria;

        div.appendChild(input);
        div.appendChild(label);
        divCategorias.appendChild(div);
    });

    chkTodas.addEventListener("change", () => {
        divCategorias.style.display = chkTodas.checked ? "none" : "block";
    });

    divCategorias.style.display = chkTodas.checked ? "none" : "block";

    btnGenerar.addEventListener("click", () => {
        const contribuciones = dataManager.readData();

        let categoriasSeleccionadas;

        if (chkTodas.checked) {
            categoriasSeleccionadas = categoriasUnicas;
        } else {
            const checks = document.querySelectorAll("#categoriaCheckboxes input[name='categorias']:checked");
            categoriasSeleccionadas = Array.from(checks).map(c => c.value);

            if (categoriasSeleccionadas.length === 0) {
                alert("Selecciona al menos una categoría o marca 'Todas'");
                return;
            }
        }

        const datosFiltrados = contribuciones.filter(c => categoriasSeleccionadas.includes(c.categoria));
        generarReportePDF(datosFiltrados);
    });
});

async function generarReportePDF(contribuciones) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const urlIzquierda = "/src/assets/image/logo itvo.png";
    const urlDerecha = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tecnologico_Nacional_de_Mexico.svg/1280px-Tecnologico_Nacional_de_Mexico.svg.png";

    try {
        const imgIzq = await cargarImagenBase64(urlIzquierda);
        const imgDer = await cargarImagenBase64(urlDerecha);

        // ENCABEZADO
        doc.addImage(imgIzq, "JPEG", 10, 10, 25, 25);
        doc.addImage(imgDer, "JPEG", 155, 10, 50, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Reporte de Contribuciones", 105, 20, { align: "center" });



        // TABLA
        const cuerpo = contribuciones.map(c => [
            c.id,
            c.titulo,
            c.descripcion,
            c.categoria,
            c.fecha,
            c.autor,
            c.nombreArchivo || ""
        ]);

        doc.autoTable({
            head: [["ID", "Título", "Descripción", "Categoría", "Fecha", "Autor", "Archivo"]],
            body: cuerpo,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                halign: "center"
            },


        });

        doc.addPage();

        // ENCABEZADO
        doc.addImage(imgIzq, "JPEG", 10, 10, 25, 25);
        doc.addImage(imgDer, "JPEG", 155, 10, 50, 25);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Grafica  de Contribuciones", 105, 20, { align: "center" });



        let posX = 20;
        const posY = 80;
        const anchoBarra = 20;
        const espacio = 15;
        const alturaMax = 60;

        // GRÁFICA DE BARRAS
        const conteo = {};
        for (const item of contribuciones) {
            conteo[item.categoria] = (conteo[item.categoria] || 0) + 1;
        }

        const valores = Object.values(conteo);
        const max = Math.max(...valores);

        const colores = [
            [50, 150, 255],
            [255, 99, 132],
            [255, 206, 86],
            [75, 192, 192],
            [153, 102, 255],
            [255, 159, 64],
            [100, 200, 100],
            [200, 100, 200]
        ];

        let colorIndex = 0;

        for (const [cat, cantidad] of Object.entries(conteo)) {
            const altura = (cantidad / max) * alturaMax;
            const color = colores[colorIndex % colores.length];
            doc.setFillColor(...color);
            doc.rect(posX, posY + alturaMax - altura, anchoBarra, altura, "F");

            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text(`${cat}`, posX + anchoBarra / 2, posY + alturaMax + 5, { align: "center" });
            doc.text(`${cantidad}`, posX + anchoBarra / 2, posY + alturaMax - altura - 2, { align: "center" });

            posX += anchoBarra + espacio;
            colorIndex++;
        }

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
                `Página ${i} de ${totalPages}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: "center" }
            );
        }

        doc.save("reporte_contribuciones.pdf");
    } catch (err) {
        console.error("Error generando PDF:", err);
    }

}


function cargarImagenBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = () => reject("Error al cargar imagen.");
        img.src = url;
    });
}
