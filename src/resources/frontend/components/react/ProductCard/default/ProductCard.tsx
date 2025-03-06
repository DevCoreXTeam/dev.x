import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// react-icons
import { BiSolidMinusCircle } from "react-icons/bi";
import { IoMdAddCircle } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa6";
// Dev.X components
import Button from "@/components/generated/Button";
import { useState, useEffect } from "react";

interface CardProps {
  imageSrc: string;
  name: string;
  description?: string;
  price?: string | number;
  className?: string;
  variant?: "neutral" | "inverse" | "outline" | "subtle" | "blurred";
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  neutral:
    "bg-white text-black focus:ring-gray-200 dark:bg-black dark:text-white",
  inverse: "bg-black text-white focus:ring-black dark:bg-white dark:text-black",
  outline:
    "border border-gray-300 text-black bg-transparent focus:ring-gray-200 dark:border-gray-600 dark:text-white",
  subtle:
    "bg-gray-200 text-gray-700 focus:ring-gray-200 dark:bg-gray-600 dark:text-white",
  blurred:
    "bg-black/40 text-white backdrop-blur-sm focus:ring-gray-400 dark:bg-white/40 dark:text-black",
};

export const ProductCard: React.FC<CardProps> = ({
  imageSrc,
  name,
  description,
  price,
  className = "",
  variant = "neutral",
}) => {
  const [statusButton, setStatusButton] = useState<
    "idle" | "success" | "loading" | "error"
  >("idle");
  const [quanty, setQuanty] = useState<string>("0");
  const [wasAddedBefore, setWasAddedBefore] = useState<boolean>(false);
  const [initialQuanty, setInitialQuanty] = useState<string>("0");
  const variantClass = variantStyles[variant];

  useEffect(() => {
    if (wasAddedBefore) {
      if (quanty === initialQuanty) {
        setStatusButton("success");
      } else if (statusButton === "success" && quanty !== initialQuanty) {
        setStatusButton("idle");
      }
    }
  }, [quanty, statusButton, initialQuanty, wasAddedBefore]);

  const handleInputFocus = () => {
    if (quanty === "0") {
      setQuanty("");
    }
  };

  const handleInputBlur = () => {
    if (quanty === "") {
      setQuanty("0");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (newValue.length > 1 && newValue.startsWith("0")) {
      newValue = newValue.replace(/^0+/, "");
    }
    setQuanty(newValue);
  };

  const handleButtonClick = () => {
    if (parseInt(quanty, 10) > 0) {
      setStatusButton("success");
      setWasAddedBefore(true);
      setInitialQuanty(quanty);
    }
  };

  const decrementQuantity = () => {
    setQuanty((prev) => {
      const num = parseInt(prev, 10);
      return String(Math.max(num - 1, 0));
    });
  };

  const incrementQuantity = () => {
    setQuanty((prev) => {
      const num = parseInt(prev, 10);
      return String(num + 1);
    });
  };

  // Button Text
  const buttonText = () => {
    if (statusButton === "success") {
      return (
        <label className="flex items-center">
          Added
          <IoIosCheckmarkCircle className="ml-3 text-lg" />
        </label>
      );
    } else if (wasAddedBefore) {
      return (
        <>
          Update
          <FaCartArrowDown className="ml-3 text-lg" />
        </>
      );
    } else {
      return (
        <>
          Add to cart
          <FaShoppingCart className="ml-3 text-lg" />
        </>
      );
    }
  };

  const isButtonDisabled = quanty === "" || parseInt(quanty, 10) <= 0;

  return (
    <motion.div
      className={cn(
        "w-[320px] overflow-hidden rounded-lg shadow-md",
        variantClass,
        className,
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative h-72 w-full">
        <img
          src={imageSrc}
          alt={name}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          className="rounded-t-lg"
        />
      </div>
      <div className="flex flex-col p-4">
        <h2 className="mb-2 text-lg font-semibold">{name}</h2>
        <p className="mb-2 text-sm text-gray-500">{description}</p>
        <section className="flex items-end justify-between">
          <div>
            <p className="mb-4 text-base font-bold text-gray-700">
              {typeof price === "number" ? `$ ${price.toFixed(2)} USD` : price}
            </p>
          </div>
          <div className="ml-4 flex items-center rounded-full border-[1px] border-black p-1 dark:border-white">
            <BiSolidMinusCircle
              className="cursor-pointer text-xl"
              onClick={decrementQuantity}
            />
            <input
              type="number"
              value={quanty}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              className="w-[80px] rounded-full bg-transparent text-center outline-none"
            />
            <IoMdAddCircle
              className="cursor-pointer text-xl"
              onClick={incrementQuantity}
            />
          </div>
        </section>
        <Button
          variant="inverse"
          full={true}
          className="mt-4 self-center py-3"
          status={statusButton}
          statusLabel={buttonText()}
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
        >
          {buttonText()}
        </Button>
      </div>
    </motion.div>
  );
};
