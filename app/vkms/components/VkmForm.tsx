'use client';

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function VkmFormRB() {
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      return;
    }

    e.preventDefault();
    setValidated(true);
    setSubmitting(true);

    const formData = new FormData(form);
    const payload = {
      code: formData.get('code')?.toString() || undefined,
      name: formData.get('name')!.toString(),
      ec: Number(formData.get('ec')),
      level: formData.get('level')!.toString(),
      location: formData.get('location')?.toString() || undefined,
      description: formData.get('description')?.toString() || undefined,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vkm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (!res.ok) {
      alert('Opslaan mislukt');
      return;
    }
    form.reset();
    setValidated(false);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="vkmName">
          <Form.Label>Naam *</Form.Label>
          <Form.Control required type="text" name="name" placeholder="Naam van de module" />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Vul een geldige naam in.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="3" controlId="vkmEc">
          <Form.Label>EC *</Form.Label>
          <Form.Control required type="number" name="ec" placeholder="15" min={1} max={60} />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Voer een waarde tussen 1 en 60 in.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="3" controlId="vkmLevel">
          <Form.Label>Level *</Form.Label>
          <Form.Select required name="level" defaultValue="">
            <option value="" disabled>Kies level</option>
            <option value="NLQF-5">NLQF-5</option>
            <option value="NLQF-6">NLQF-6</option>
          </Form.Select>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Kies een level.</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="vkmCode">
          <Form.Label>Code (optioneel)</Form.Label>
          <Form.Control name="code" type="text" placeholder="Bijv. AVANS-123" />
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="vkmLocation">
          <Form.Label>Locatie (optioneel)</Form.Label>
          <Form.Control name="location" type="text" placeholder="Breda" />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="vkmDesc">
        <Form.Label>Beschrijving (optioneel)</Form.Label>
        <Form.Control as="textarea" name="description" rows={4} placeholder="Korte omschrijving…" />
      </Form.Group>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Opslaan…' : 'Opslaan'}
      </Button>
    </Form>
  );
}
