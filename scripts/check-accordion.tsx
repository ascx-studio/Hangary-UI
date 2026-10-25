import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../registry/components/accordion";

function items() {
  return ["first", "second"].map(value => (
    <AccordionItem key={value} value={value}>
      <AccordionTrigger>{value}</AccordionTrigger>
      <AccordionContent>Answer for {value}</AccordionContent>
    </AccordionItem>
  ));
}

const single = renderToStaticMarkup(<><Accordion defaultValue={["second"]}>{items()}</Accordion><Accordion>{items()}</Accordion></>);
const names = [...single.matchAll(/<details[^>]* name="([^"]+)"/g)].map(match => match[1]);
assert.equal(names.length, 4);
assert.equal(names[0], names[1]);
assert.equal(names[2], names[3]);
assert.notEqual(names[0], names[2], "Separate accordions must not share a group");
assert.equal((single.match(/ open=""/g) ?? []).length, 1);
assert.equal((single.match(/<summary/g) ?? []).length, 4);
const multiple = renderToStaticMarkup(<Accordion multiple defaultValue={["first", "second"]}>{items()}</Accordion>);
assert.equal((multiple.match(/ open=""/g) ?? []).length, 2);
assert.doesNotMatch(multiple, /<details[^>]* name=/);
assert.throws(() => renderToStaticMarkup(<AccordionItem value="orphan" />), /inside Accordion/);
console.log("Accordion defaults, grouping, multiple mode, and context checks passed");
