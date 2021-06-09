interface ComposeMessage {
  files: {
    name: string;
    type: string;
    body: string;
  }[];
  text: string;
}

export default ComposeMessage;
