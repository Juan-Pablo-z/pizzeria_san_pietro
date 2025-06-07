import { Metadata } from "next";
import Image from "next/image";
import { getImage } from "@/helpers";
import { Recargo } from "@/interfaces";

import "@/css/external/main.css";
import Link from "next/link";
import { getProducts } from "@/actions/products.actions";
import { Button, Divider, Card, CardBody } from "@nextui-org/react";
import { ContactForm } from "@/components";

const NAVIGATE = [
  { name: "Inicio", href: "#" },
  { name: "Sobre Nosotros", href: "#about" },
  { name: "Contacto", href: "#contact" },
];

const RESTAURANT_INFO = [
  {
    icon: "i-mdi-location-radius-outline",
    title: "Nuestra Ubicación",
    description:
      "Somos un restaurante en el barrio Zulima, que se encuentra en funcionamiento desde el año 2015 en la ciudad de Cúcuta, Norte de Santander",
  },
  {
    icon: "i-ion-restaurant-outline",
    title: "¿Qué Ofrecemos?",
    description:
      "En San Pietro nos apasiona el sabor italiano. Preparamos pizzas artesanales con ingredientes frescos y recetas tradicionales, en un ambiente familiar y acogedor para disfrutar momentos especiales.",
  },
  {
    icon: "i-mdi-star-outline",
    title: "Visión",
    description:
      "Ser la pizzería preferida en la región, reconocida por su sabor, atención al cliente e innovación, manteniendo nuestra esencia artesanal y compromiso con la calidad y la comunidad.",
  },
  {
    icon: "i-mdi-handshake-outline",
    title: "Misión",
    description:
      "En San Pietro, buscamos deleitar con pizzas artesanales de calidad, usando ingredientes frescos y locales, brindando un servicio cálido y un ambiente acogedor para compartir en familia y con amigos.",
  },
  {
    icon: "i-mdi-hand-heart-outline",
    title: "Te Esperamos",
    description:
      "¡Visítanos y disfruta de la mejor pizza artesanal! San Pietro, sabor que reúne.",
  },
];

const CONTACT_INFO = [
  { icon: "i-mdi-phone-outline", text: "+57 315 2861376" },
  { icon: "i-mdi-email-outline", text: "sanpietropizzeria9@gmail.com" },
  { icon: "i-mdi-location-outline", text: "Barrio Zulima, Cúcuta" },
];

export const metadata: Metadata = {
  title: "Pizzeria San Pietro",
  description:
    "Pizzeria San Pietro, un rincón para disfrutar comida de calidad en el barrio Zulima de Cúcuta",
};

export default async function Home() {
  const products = await getProducts();

  const getPasajeroRecargo = (recargos: Recargo[]) => {
    return recargos.find((r) => r.fkcod_tc_rec === 2)?.recargo_cliente || 0;
  };

  return (
    <>
      {/* Header y menú */}
      <header className="p-section">
        <Image
          className="rounded-full"
          width={64}
          height={64}
          src="/images/san_pietro_logo.png"
          alt="logo san pietro"
        />
        <nav>
          <ul>
            {NAVIGATE.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Button className="btn btn-primary">
          <Link className="text-white" href="/iniciar-sesion">Iniciar sesión</Link>
        </Button>
      </header>
      {/* Inicio */}
      <section className="img-background md:h-[30rem] lg:h-[30rem]" id="start">
        <div className="p-section">
          <div className="title-container">
            <h1>
              Bienvenidos a <br />
              Pizzeria San Pietro
            </h1>
            <p>
              Un rincón para disfrutar comida de calidad en la terminal de
              transportes de Cúcuta
            </p>
          </div>
          <div className="separator-container">
            <i className="i-fluent-food-grains-20-regular"></i>
            <i className="i-ion-restaurant-outline"></i>
            <i className="i-fluent-food-grains-20-regular"></i>
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section id="about" className="p-section">
        <h2 className="title">Sobre nosotros</h2>
        <div>
          <div className="img-container">
            <Image
              className="rounded-full"
              width={160}
              height={160}
              src="/images/san_pietro_logo.png"
              alt="logo san pietro"
            />
            <p>
              Pizzeria San Pietro es un lugar donde podrás disfrutar de una
              deliciosa comida y platos especiales del día.
            </p>
          </div>
          <ul>
            {RESTAURANT_INFO.map((r) => (
              <li key={r.icon}>
                <div className="icon-container">
                  <i className={r.icon}></i>
                </div>
                <div className="info-container">
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="pt-4 pl-8 pr-8">
      <Divider className="my-4" />
      </div>
      {/* Menú */}
      {/* <section id="menu" className="p-section">
        <h2 className="title">Nuestro menú</h2>
        <div className="dish-grid mt-8">
          {products.map((p) => (
            <Card key={p.cod_prod} className="dish-card">
              <Image
                width={300}
                height={1000}
                src={getImage(p.img_prod)}
                alt={p.nom_prod}
              />
              <CardBody className="dish-info">
                <h3>{p.nom_prod}</h3>
                <p className="line-clamp-2">{p.dprod}</p>
                <span>
                  ${" "}
                  {(
                    p.precio_base + getPasajeroRecargo(p.recargos)
                  ).toLocaleString()}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      </section> */}
      {/* Contacto */}
      <section id="contact" className="p-section">
        <h2 className="title">Contacto</h2>
        <div className="contact-info">
          {CONTACT_INFO.map((c) => (
            <div key={c.icon} className="contact-item">
              <div className="icon-container">
                <i className={c.icon}></i>
              </div>
              <p className="paragraph">{c.text}</p>
            </div>
          ))}
        </div>
        <ContactForm />
      </section>

      {/* Footer */}
      <footer className="p-section">
        <div className="footer-container">
          <div className="logo">
            <Image
              className="rounded-full"
              width={160}
              height={160}
              src="/images/san_pietro_logo.png"
              alt="Logo de Pizzeria San Pietro"
            />
            <p className="paragraph">
              Somos un restaurante en el barrio Zulima, que se encuentra
              en funcionamiento desde el año 2015 en la ciudad de Cúcuta, Norte
              de Santander.
            </p>
          </div>
          <div className="footer-info">
            <div className="footer-sections">
              <h3 className="subtitle">Secciones</h3>
              <ul>
                {NAVIGATE.map((n) => (
                  <li key={n.href}>
                    <a href={n.href}>{n.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-contact">
              <h3 className="subtitle">Contáctanos</h3>
              {CONTACT_INFO.map((c) => (
                <p key={c.icon} className="paragraph">
                  <i className={c.icon}></i>
                  <span> {c.text} </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright">
        <div className="p-section text-white">
          Copyright © 2025 - Todos los derechos reservados
        </div>
      </div>
    </>
  );
}
