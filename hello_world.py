#!/usr/bin/env python3
"""
Simple Calculator Script

A basic calculator that supports:
- Addition
- Subtraction
- Multiplication
- Division
"""

def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract two numbers."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide two numbers."""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def main():
    """Main calculator function."""
    print("Welcome to the Calculator!")
    print("Operations: +, -, *, /")
    
    while True:
        try:
            num1 = float(input("\nEnter first number (or 'quit' to exit): "))
            op = input("Enter operation (+, -, *, /): ")
            num2 = float(input("Enter second number: "))
            
            if op == '+':
                result = add(num1, num2)
            elif op == '-':
                result = subtract(num1, num2)
            elif op == '*':
                result = multiply(num1, num2)
            elif op == '/':
                result = divide(num1, num2)
            else:
                print("Invalid operation. Please try again.")
                continue
            
            print(f"Result: {num1} {op} {num2} = {result}")
            
        except ValueError as e:
            if "could not convert string to float" in str(e):
                print("Exiting calculator. Goodbye!")
                break
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nExiting calculator. Goodbye!")
            break

if __name__ == "__main__":
    main()
