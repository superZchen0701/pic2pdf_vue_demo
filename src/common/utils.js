import { jsPDF } from 'jspdf';

export default {
    async convertPic2Pdf(imgList, callback = () => {}) {
        const doc = new jsPDF('p', 'px', 'a4', false, true);
        const margin = 5;
        let isBegin = true;
        for (const img of imgList) {
            if (!isBegin) {
                doc.addPage();
            } else {
                isBegin = false;
            }
            const { newX, newY } = this.getNewPdfSize({
                doc,
                margin,
                size: img.size.split('x')
            });
            let imgUrl;
            if (!img.isBase64) {
                // Load the image
                const image = new Image();
                image.src = img.url;
                await new Promise((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = reject;
                });
                // create canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = newX;
                canvas.height = newY;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // Finally, add the image to the pdf, with quick compression
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, 'image/png');
                });
                imgUrl = URL.createObjectURL(blob);
            } else {
                imgUrl = img.url;
            }
            doc.addImage(imgUrl, margin, margin, newX, newY);
        }
        const url = doc.output('bloburl', 'PNG');
        window.open(url);
        callback();
    },
    getNewPdfSize(params) {
        const { doc, margin, size } = params;
        const maxX = doc.internal.pageSize.getWidth() - margin;
        const maxY = doc.internal.pageSize.getHeight() - margin;
        const scaleX = maxX / size[0];
        const scaleY = maxY / size[1];
        if (scaleX < scaleY) {
            return {
                newX: maxX,
                newY: size[1] * (maxX / size[0]),
            };
        }
        return {
            newX: size[0] * (maxY / size[1]),
            newY: maxY,
        };
    }
}