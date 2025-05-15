const openBlank = (url: string): void => {
  window.open(url, "_blank");
};

export const redirectWhatsApp = async (
  number: string,
  body: string
): Promise<void> => {
  const encodedBody = encodeURIComponent(body);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    const iosURL = `whatsapp://send?phone=${number}&text=${encodedBody}`;
    openBlank(iosURL);
  }

  if (isAndroid) {
    const androidURL = `whatsapp://send?text=${encodedBody}&phone=${number}`;
    openBlank(androidURL);
  }

  const webURL = `https://wa.me/${number}?text=${body}`;
  openBlank(webURL);
};
