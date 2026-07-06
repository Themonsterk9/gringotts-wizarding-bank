import { useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";

import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";
import PageTransition from "../../components/animation/PageTransition";

import {transferMoney, lookupVault,} from "../../services/vaultService";

import "./Transfer.css";

const Transfer = () => {
  const [receiverVault, setReceiverVault] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleVaultLookup = async (vaultNumber) => {
  if (vaultNumber.trim().length < 10) {
    setRecipient(null);
    setLookupError("");
    return;
  }

  try {
    setLookupLoading(true);
    setLookupError("");

    const data = await lookupVault(vaultNumber);

    setRecipient(data.recipient);

  } catch (error) {

    setRecipient(null);

    setLookupError(
      error.response?.data?.message ||
      "Vault not found."
    );

  } finally {
    setLookupLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await transferMoney({
       receiverVaultNumber: receiverVault,
        amount: Number(amount),
         description,
        });

      toast.success(data.message);

      setReceiverVault("");
      setAmount("");
      setDescription("");
      setRecipient(null);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Transfer failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>

      <Layout>

        <div className="transfer-page">

          <AnimatedCard>

            <Card title="🔄 Transfer Galleons">

              <form
                className="transfer-form"
                onSubmit={handleSubmit}
              >

                <AnimatedInput
                  type="text"
                  placeholder="Receiver Vault Number"
                  value={receiverVault}
                  onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  setReceiverVault(value);

                  handleVaultLookup(value);
                  }}
                  required
               />

                  {lookupLoading && (
                  <p className="lookup-loading">
                🔍 Searching vault...
                  </p>
                )}

                  {recipient && (
                 <div className="recipient-card">

                 <h4>👤 Recipient Found</h4>

                 <p>
                 <strong>Wizard:</strong>{" "}
                 {recipient.wizardName}
                 </p>

                 <p>
                 <strong>Vault:</strong>{" "}
                 {recipient.vaultNumber}
                 </p>

                  <p>
                 <strong>Status:</strong>{" "}
                 <span className="recipient-status">
                 {recipient.status}
                 </span>
                 </p>

                 </div>
                )}

                {lookupLoading && (
                <p className="lookup-loading">
                 🔍 Looking up vault...
                </p>
              )}

                  {lookupError && (
                 <p className="lookup-error">
                ❌ {lookupError}
                 </p>
                )}

                <AnimatedInput
                  type="number"
                  placeholder="Transfer Amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  required
                />

                <AnimatedInput
                  type="text"
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

                <AnimatedButton
                  className="transfer-btn"
                  type="submit"
                  disabled={loading || !recipient}
                >
                  {loading
                    ? "Transferring..."
                    : "✨ Transfer Galleons"}
                </AnimatedButton>

              </form>

            </Card>

          </AnimatedCard>

        </div>

      </Layout>

    </PageTransition>
  );
};

export default Transfer;