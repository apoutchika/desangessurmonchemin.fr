import mitt from "mitt";

type Events = {
  "elevation:hover": number | null;
};

export const emitter = mitt<Events>();
