import { useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";

import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";
import PageTransition from "../../components/animation/PageTransition";

import { depositMoney } from "../../services/vaultService";

import "./Deposit.css";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await depositMoney({
        amount: Number(amount),
        description,
      });

      toast.success(data.message);

      setAmount("");
      setDescription("");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Deposit failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>

      <Layout>

        <div className="deposit-page">

          <AnimatedCard>

            <Card title="💰 Deposit Galleons">

              <form
                className="deposit-form"
                onSubmit={handleSubmit}
              >

                <AnimatedInput
                  type="number"
                  placeholder="Enter Deposit Amount"
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
                  className="deposit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Depositing..."
                    : "✨ Deposit Galleons"}
                </AnimatedButton>

              </form>

            </Card>

          </AnimatedCard>

        </div>

      </Layout>

    </PageTransition>
  );
};

export default Deposit;