const openBlank = (url: string): void => {
  window.open(url, "_blank");
};

export const redirectWhatsApp = async (
  number: string,
  body: string
): Promise<void> => {
  const encodedBody = encodeURIComponent(body);

  const userAgent = navigator.userAgent || navigator.vendor;

  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = isIOS || isAndroid;

  if (isIOS) {
    const iosURL = `whatsapp://send?phone=${number}&text=${encodedBody}`;
    openBlank(iosURL);
    return;
  }

  if (isAndroid) {
    const androidURL = `whatsapp://send?phone=${number}&text=${encodedBody}`;
    openBlank(androidURL);
    return;
  }

  // Escritorio (PC o navegador sin WhatsApp nativo)
  const webURL = `https://web.whatsapp.com/send?phone=${number}&text=${encodedBody}`;
  openBlank(webURL);
};

