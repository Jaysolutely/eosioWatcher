import { html, render } from "lit-html";
import JSONEditor from "jsoneditor";
import { eosioNodeUrl } from "../../settings.json";

const container = document.getElementById("editor-container");
const editor = new JSONEditor(container, { mode: "view" });

const list = [];

function getBlockdata(block_num, index) {
  return fetch(`${eosioNodeUrl}/v1/chain/get_block`, {
    method: "POST",
    body: JSON.stringify({ block_num_or_id: block_num }),
  })
    .then((data) => data.json())
    .then((data) => {
      list[index].blockdata = data;
      return data;
    });
}

function setBlockdata(index) {
  const { block_num, blockdata } = list[index];
  if (blockdata === null)
    getBlockdata(block_num, index).then((data) => editor.set(data));
  else editor.set(blockdata);
}

function handleNewBlock({ data: block_num }) {
  list.push({ block_num, blockdata: null });
  refresh();
}

function refresh() {
  render(
    html`
      <h1>Latest transactions</h1>
      ${list.map(
        (values, index) =>
          html`
            <button @click=${() => setBlockdata(index)}>
              #${list[index].block_num}
            </button>
          `
      )}
    `,
    document.getElementById("lit-container")
  );
}

const events = new EventSource("http://localhost:8887/blocks");
events.onmessage = handleNewBlock;

render(
  html`<h1>Latest transactions</h1>`,
  document.getElementById("lit-container")
);
