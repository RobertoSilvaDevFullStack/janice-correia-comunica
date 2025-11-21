declare module "*?format=*" {
  const src: string;
  export default src;
}

declare module "*?w=*" {
  const src: string;
  export default src;
}

declare module "*?format=webp&w=*" {
  const src: string;
  export default src;
}

declare module "*?*" {
  const src: string;
  export default src;
}
